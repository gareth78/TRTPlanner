export async function handleLogin(username: string, password: string): Promise<void> {
  if (username === 'admin' && password === 'password') {
    localStorage.setItem('access_token', 'mock_token')
  } else {
    throw new Error('Invalid credentials')
  }
}
