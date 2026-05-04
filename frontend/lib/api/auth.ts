const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
}

export async function register(email: string, password: string, fullName: string) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, fullName }),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return response.json();
}

export async function getCurrentUser() {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
}