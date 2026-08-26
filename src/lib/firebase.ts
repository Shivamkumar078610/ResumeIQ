import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { ResumeData, ATSAnalysisResult } from '../types';

const app = initializeApp(firebaseConfig);
const customDbId = (firebaseConfig as any).firestoreDatabaseId;
export const db = customDbId ? getFirestore(app, customDbId) : getFirestore(app);
export const auth = getAuth(app);

export const GOOGLE_CALENDAR_SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
];

const googleProvider = new GoogleAuthProvider();
GOOGLE_CALENDAR_SCOPES.forEach((scope) => {
  googleProvider.addScope(scope);
});

// In-memory access token cache (do not store in localStorage)
let cachedAccessToken: string | null = null;

export const setCachedAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client appears offline or connection pending.');
    }
  }
}

// Trigger initial connection verification
testConnection();

// Authentication helpers
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      cachedAccessToken = credential.accessToken;
    }
    // Ensure user doc exists
    if (result.user) {
      await syncUserDoc(result.user);
    }
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
}

export async function loginWithEmail(email: string, pass: string) {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  if (result.user) {
    await syncUserDoc(result.user);
  }
  return result.user;
}

export async function registerWithEmail(email: string, pass: string, name?: string) {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  if (result.user) {
    if (name) {
      await updateProfile(result.user, { displayName: name });
    }
    await syncUserDoc(result.user, name);
  }
  return result.user;
}

export async function signOutUser() {
  cachedAccessToken = null;
  return await fbSignOut(auth);
}

export function subscribeToAuth(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    if (!user) {
      cachedAccessToken = null;
    }
    callback(user);
  });
}

async function syncUserDoc(user: FirebaseUser, overrideName?: string) {
  const path = `users/${user.uid}`;
  try {
    const userRef = doc(db, 'users', user.uid);
    const existing = await getDoc(userRef);
    if (!existing.exists()) {
      await setDoc(userRef, {
        userId: user.uid,
        email: user.email || '',
        displayName: overrideName || user.displayName || 'Candidate',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(
        userRef,
        {
          email: user.email || '',
          displayName: overrideName || user.displayName || existing.data().displayName || 'Candidate',
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Resume Firestore operations
export interface SavedResumeRecord {
  id: string;
  userId: string;
  title: string;
  resumeData: ResumeData;
  createdAt: any;
  updatedAt: any;
}

export async function saveResumeToCloud(
  resumeId: string,
  title: string,
  resumeData: ResumeData
): Promise<SavedResumeRecord> {
  const user = auth.currentUser;
  if (!user) throw new Error('Must be signed in to save resumes to the cloud.');

  const path = `resumes/${resumeId}`;
  try {
    const resumeRef = doc(db, 'resumes', resumeId);
    const existing = await getDoc(resumeRef);
    const isExisting = existing.exists();

    const payload: any = {
      id: resumeId,
      userId: user.uid,
      title: title || `${resumeData.personalInfo.firstName || 'My'} Resume`,
      resumeData,
      updatedAt: serverTimestamp(),
    };

    if (!isExisting) {
      payload.createdAt = serverTimestamp();
    } else {
      payload.createdAt = existing.data().createdAt;
    }

    await setDoc(resumeRef, payload);
    return {
      ...payload,
      createdAt: isExisting ? existing.data().createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    handleFirestoreError(error, isExistingSafe(resumeId) ? OperationType.UPDATE : OperationType.CREATE, path);
  }
}

function isExistingSafe(_id: string) {
  return true;
}

export async function loadUserResumes(): Promise<SavedResumeRecord[]> {
  const user = auth.currentUser;
  if (!user) return [];

  const path = 'resumes';
  try {
    const q = query(collection(db, 'resumes'), where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    const results: SavedResumeRecord[] = [];
    querySnapshot.forEach((docSnap) => {
      results.push(docSnap.data() as SavedResumeRecord);
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function deleteResumeFromCloud(resumeId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Must be signed in to delete resumes.');

  const path = `resumes/${resumeId}`;
  try {
    await deleteDoc(doc(db, 'resumes', resumeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Analysis Firestore operations
export interface SavedAnalysisRecord {
  id: string;
  userId: string;
  targetRole: string;
  overallScore: number;
  matchLevel: string;
  analysisData: ATSAnalysisResult;
  createdAt: any;
}

export async function saveAnalysisToCloud(analysis: ATSAnalysisResult): Promise<void> {
  const user = auth.currentUser;
  if (!user) return; // Silent if guest

  const analysisId = `analysis_${Date.now()}`;
  const path = `analyses/${analysisId}`;
  try {
    const analysisRef = doc(db, 'analyses', analysisId);
    await setDoc(analysisRef, {
      id: analysisId,
      userId: user.uid,
      targetRole: analysis.targetRole || 'Target Role',
      overallScore: analysis.overallScore,
      matchLevel: analysis.matchLevel,
      analysisData: analysis,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function loadUserAnalyses(): Promise<SavedAnalysisRecord[]> {
  const user = auth.currentUser;
  if (!user) return [];

  const path = 'analyses';
  try {
    const q = query(collection(db, 'analyses'), where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    const results: SavedAnalysisRecord[] = [];
    querySnapshot.forEach((docSnap) => {
      results.push(docSnap.data() as SavedAnalysisRecord);
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}


