import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export function initFirebaseAuth(cb: (uid: string | null) => void) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      cb(user.uid);
    } else {
      try {
        const cred = await signInAnonymously(auth);
        cb(cred.user.uid);
      } catch {
        cb(null);
      }
    }
  });
}

export async function saveSchedule(
  uid: string,
  drugName: string,
  data: unknown,
) {
  await setDoc(doc(db, 'users', uid, 'schedules', drugName), data);
}

export async function loadSchedule(uid: string, drugName: string) {
  const snap = await getDoc(doc(db, 'users', uid, 'schedules', drugName));
  return snap.exists() ? snap.data() : null;
}
