import { Component } from '@angular/core';
import { UsersComponent } from "./pages/user.component";
import { DepositsComponent } from "./pages/deposits.component";
import { WalletsComponent } from "./pages/wallet.component";
import { NgIf } from '@angular/common';
import { WithdrawMethodsComponent } from './pages/withdraw-methods.component';
import { WithdrawsComponent } from "./pages/withdraws.component";

@Component({
  selector: 'app-admin',
  imports: [UsersComponent, DepositsComponent, WalletsComponent, WithdrawMethodsComponent, NgIf, WithdrawsComponent],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  tab = 'wallets';
}
