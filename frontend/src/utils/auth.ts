import api from './api';
import type { Profile } from './types';

export async function register(data: { firstName: string; lastName: string; email: string; password: string }) {
  const res = await api.post('/api/auth/register', data);
  return res.data as { id: string; firstName: string; lastName: string; email: string };
}

export async function login(data: { email: string; password: string }) {
  const res = await api.post('/api/auth/login', data);
  return res.data as { id: string; firstName: string; lastName: string; email: string };
}

export async function logout() {
  await api.post('/api/auth/logout');
}

export async function getMe() {
  const res = await api.get('/api/user/me');
  return res.data as { id: string; firstName: string; lastName: string; email: string; profile?: Profile };
}

export async function updateProfile(profile: Profile) {
  const res = await api.put('/api/user/profile', profile);
  return res.data as { profile: Profile };
}


