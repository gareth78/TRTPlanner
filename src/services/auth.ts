import { loginWithEmail } from '../firebase/firebase';

export default async function handleLogin(
  email: string,
  password: string,
): Promise<void> {
  await loginWithEmail(email, password);
}
