import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WithdrawalsService {

  private api = environment.backendURL;

  constructor(private http: HttpClient) {}

  createWithdraw(data: any): Observable<any> {
    return this.http.post(this.api + '/withdrawals', data);
  }

  // 🔹 MIS RETIROS
  getMyWithdrawals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/withdrawals/me`);
  }

  // 🔹 ADMIN (todos)
  getAllWithdrawals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/withdrawals`);
  }

  // 🔥 CAMBIAR STATUS (admin)
  updateStatus(id: string, status: 'approved' | 'rejected') {
    return this.http.patch(`${this.api}/withdrawals/${id}/status`, { status });
  }

  updateWithdrawStatus(id: string, status: 'approved' | 'rejected') {
  return this.http.patch(
    `${this.api}/withdrawals/${id}/status`,
    { status }
  );
}
}