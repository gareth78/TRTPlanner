import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import app from '../firebase/config';

const db = getFirestore(app);

interface UserData {
  settings?: Record<string, unknown>;
  injectionSchedule?: Record<string, unknown>;
  oralSchedule?: unknown[];
}

export async function loadUserData(uid: string): Promise<UserData> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as UserData) : {};
}

export async function saveUserData(uid: string, data: Partial<UserData>): Promise<void> {
  const ref = doc(db, 'users', uid);
  await setDoc(ref, data, { merge: true });
}

export async function clearUserData(uid: string): Promise<void> {
  const ref = doc(db, 'users', uid);
  await setDoc(ref, {}, { merge: true });
}
