import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private api = environment.backendURL;

  constructor(private http: HttpClient) {}
getWithdrawMethods() {
  return this.http.get(`${this.api}/withdraw-methods`);
}

createWithdrawMethod(formData: FormData) {
  return this.http.post(`${this.api}/withdraw-methods`, formData);
}
updateWithdrawMethod(id: string, data: FormData) {
  return this.http.patch(`${this.api}/withdraw-methods/${id}`, data);
}
toggleWithdrawMethod(id: string) {
  return this.http.patch(`${this.api}/withdraw-methods/${id}/toggle`, {});
}
  // 👛 Wallets
  createWallet(data: any, file?: File) {
    const formData = new FormData();
    formData.append('network', data.network);
    formData.append('address', data.address);

    if (file) {
      formData.append('qr', file);
    }

    return this.http.post(`${this.api}/wallets`, formData);
  }

  activateWallet(id: string) {
    return this.http.patch(`${this.api}/wallets/${id}/activate`, {});
  }

  getWallets() {
    return this.http.get(`${this.api}/wallets`);
  }

  // 💸 Deposits
  getDeposits() {
    return this.http.get(`${this.api}/deposits`);
  }

  approveDeposit(id: string) {
    return this.http.patch(`${this.api}/deposits/${id}/approve`, {});
  }

  rejectDeposit(id: string) {
    return this.http.patch(`${this.api}/deposits/${id}/reject`, {});
  }

  getUsers() {
    return this.http.get(`${this.api}/user`);
  }

  getKyc(userId: string) {
    return this.http.get(`${this.api}/user/${userId}/kyc`);
  }

  updateKyc(id: string, status: string) {
    return this.http.patch(`${this.api}/user/${id}/kyc`, { status });
  }
  changeRole(userId: string, role: string) {
    return this.http.patch(`${this.api}/user/${userId}/role`, { role });
  }

  // 💰 Balance
  addBalance(userId: string, amount: number) {
    return this.http.patch(`${this.api}/user/${userId}/balance`, { amount });
  }
}