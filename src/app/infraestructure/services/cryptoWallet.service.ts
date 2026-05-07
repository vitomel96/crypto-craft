import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class CryptoWalletsService {

  private api = environment.backendURL;

  constructor(private http: HttpClient) {}
  getAll() {
    return  this.http.get('/api/wallets/active');
}
}

