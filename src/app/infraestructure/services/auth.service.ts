import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = environment.backendURL;

  constructor(private http: HttpClient) {}

  // 🔐 AUTH
  getDecodedToken(): JwtPayload | null {
  const token = this.getToken();

  if (!token) return null;

  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}

  register(data: any) {
    data = { ...data, kycStatus: 'none' };
    return this.http.post(`${this.api}/auth/register`, data);
  }

  login(data: any) {
    return this.http.post<{
      access_token: string;
      user: any;
    }>(`${this.api}/auth/login`, data);
  }

  loginGoogle(token: string) {
    return this.http.post<{
      access_token: string;
      user: any;
    }>(`${this.api}/auth/google`, { token });
  }

  // 💾 SESSION (🔥 CLAVE)

  saveSession(token: string, user: any) {
    localStorage.setItem('token', token);
    const userDecoded = this.getDecodedToken();
    localStorage.setItem('user', userDecoded ? JSON.stringify(userDecoded) : '{}');
  }

  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
      window.location.reload();
  }

  // 👤 USER

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  }

  // 🔑 TOKEN

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  clearToken() {
    localStorage.removeItem('token');
  }

  // 🔥 INTERCEPTOR

  async fetchToken(): Promise<string> {
    const token = this.getToken();

    if (token) {
      return token;
    }

    throw new Error('No token available');
  }

  // ✅ LOGIN STATE CORRECTO


isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (!decoded.exp) return true;

    const now = Date.now() / 1000;

    return decoded.exp < now;
  } catch (e) {
    return true;
  }
}
isLoggedIn(): boolean {
  const token = this.getToken();

  if (!token) return false;

  return !this.isTokenExpired(token);
}

  // 🚀 OPCIONAL (PRO): obtener user desde backend si no existe

  async fetchUser() {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    const res = await firstValueFrom(
      this.http.get(`${this.api}/auth/me`)
    );

    localStorage.setItem('user', JSON.stringify(res));

    return res;
  }
}