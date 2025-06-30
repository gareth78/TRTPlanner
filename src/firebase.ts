import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAzi83JX-klIIak_S1jvXrDUjvSwiaLRFo",
  authDomain: "meditrack-c20a7.firebaseapp.com",
  projectId: "meditrack-c20a7",
  storageBucket: "meditrack-c20a7.firebasestorage.app",
  messagingSenderId: "718086036874",
  appId: "1:718086036874:web:409b553b32bf9ac35b3c73",
  measurementId: "G-TLYF3TTXMD"
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
