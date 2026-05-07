import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {

  private api = environment.backendURL;

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  getMe() {
    return this.http.get(`${this.api}/user/me`).pipe(
      tap((user: any) => {
        this.userSubject.next(user);
      })
    );
  }
  updateProfile(data: any) {
    return this.http.patch(`${this.api}/user/me`, data);
  }

  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post(`${this.api}/user/avatar`, formData).pipe(
      tap(() => this.refreshUser())
    );
  } 

  createDeposit(formData: FormData) {
    return this.http.post(`${this.api}/deposits`, formData);
  }

getWallets() {
  return this.http.get(`${this.api}/wallets?active=true`);
}
  refreshUser() {
    return this.getMe().subscribe();
  }

  getCurrentUser() {
    return this.userSubject.value;
  }

  clearUser() {
    this.userSubject.next(null);
  }
  
  uploadKyc(document: File, selfie: File) {
  const formData = new FormData();

  formData.append('document', document);
  formData.append('selfie', selfie);

  return this.http.post(`${this.api}/kyc`, formData);
}
}