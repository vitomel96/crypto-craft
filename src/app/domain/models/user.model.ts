export interface User {
  id: string;
  email: string;
  balance: number;
  role: 'admin' | 'user';
}