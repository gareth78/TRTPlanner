import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  linkWithCredential,
  EmailAuthProvider,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  linkWithPopup,
  sendPasswordResetEmail,
  type User,
} from 'firebase/auth';
import type { FirebaseError } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAzi83JX-klIIak_S1jvXrDUjvSwiaLRFo',
  authDomain: 'meditrack-c20a7.firebaseapp.com',
  projectId: 'meditrack-c20a7',
  storageBucket: 'meditrack-c20a7.appspot.com', // ✅ Correct domain
  messagingSenderId: '718086036874',
  appId: '1:718086036874:web:409b553b32bf9ac35b3c73',
  measurementId: 'G-TLYF3TTXMD',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

// Use local persistence so sessions survive reloads
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error('Failed to set persistence:', err);
});

// Manual anonymous sign-in is triggered from the login screen
export function loginAnonymously() {
  return signInAnonymously(auth);
}

// Listen for auth state changes
export function initFirebaseAuth(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    cb(user);
  });
}

// Save a schedule to Firestore
export async function saveSchedule(
  uid: string | undefined,
  drugName: string,
  data: unknown,
) {
  if (!uid) throw new Error('saveSchedule requires a user id');
  await setDoc(doc(db, 'users', uid, 'schedules', drugName), data);
}

// Load a schedule from Firestore
export async function loadSchedule(uid: string | undefined, drugName: string) {
  if (!uid) return null;
  const snap = await getDoc(doc(db, 'users', uid, 'schedules', drugName));
  return snap.exists() ? snap.data() : null;
}

// Delete a schedule from Firestore
export async function deleteSchedule(uid: string | undefined, drugName: string) {
  if (!uid) throw new Error('deleteSchedule requires a user id');
  await deleteDoc(doc(db, 'users', uid, 'schedules', drugName));
}

// Create account or link anonymous user to email/password
export async function signUpWithEmail(email: string, password: string) {
  if (auth.currentUser && auth.currentUser.isAnonymous) {
    const cred = EmailAuthProvider.credential(email, password);
    try {
      const res = await linkWithCredential(auth.currentUser, cred);
      return res.user;
    } catch (err: unknown) {
      const { code } = err as FirebaseError;
      if (code === 'auth/credential-already-in-use') {
        const userCred = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        return userCred.user;
      }
      throw err;
    }
  }
  const res = await createUserWithEmailAndPassword(auth, email, password);
  return res.user;
}

// Login user, linking anonymous account if present
export async function loginWithEmail(email: string, password: string) {
  if (auth.currentUser && auth.currentUser.isAnonymous) {
    const cred = EmailAuthProvider.credential(email, password);
    try {
      const res = await linkWithCredential(auth.currentUser, cred);
      return res.user;
    } catch (err: unknown) {
      const { code } = err as FirebaseError;
      if (code === 'auth/credential-already-in-use') {
        const userCred = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        return userCred.user;
      }
      throw err;
    }
  }
  const res = await signInWithEmailAndPassword(auth, email, password);
  return res.user;
}

// Social login with Google
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  if (auth.currentUser && auth.currentUser.isAnonymous) {
    try {
      const res = await linkWithPopup(auth.currentUser, provider);
      return res.user;
    } catch (err: unknown) {
      const { code } = err as FirebaseError;
      if (code === 'auth/credential-already-in-use') {
        const userCred = await signInWithPopup(auth, provider);
        return userCred.user;
      }
      throw err;
    }
  }
  const res = await signInWithPopup(auth, provider);
  return res.user;
}

// Social login with Facebook
export async function loginWithFacebook() {
  const provider = new FacebookAuthProvider();
  if (auth.currentUser && auth.currentUser.isAnonymous) {
    try {
      const res = await linkWithPopup(auth.currentUser, provider);
      return res.user;
    } catch (err: unknown) {
      const { code } = err as FirebaseError;
      if (code === 'auth/credential-already-in-use') {
        const userCred = await signInWithPopup(auth, provider);
        return userCred.user;
      }
      throw err;
    }
  }
  const res = await signInWithPopup(auth, provider);
  return res.user;
}

export function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}
