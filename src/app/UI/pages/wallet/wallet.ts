import { CurrencyPipe, DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../../infraestructure/services/user.service';
import { CryptoWalletsService } from '../../../infraestructure/services/cryptoWallet.service';
import { MatDialog } from '@angular/material/dialog';
import { QrDialogComponent } from '../admin/pages/qr-modal.component';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AdminService } from '../../../infraestructure/services/admin.service';
import { WithdrawalsService } from '../../../infraestructure/services/withdrawals.service';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [NgClass, CurrencyPipe, NgIf, NgFor, DecimalPipe, FormsModule],
  templateUrl: './wallet.html',
  styleUrl: './wallet.css',
})
export class Wallet {

  constructor(
    private userService: UserService,
    private cryptoWalletsService: CryptoWalletsService,
    private dialog: MatDialog,
    private admin: AdminService,
    private withdrawService: WithdrawalsService
  ) {}

  method: 'bank' | 'crypto' | null = 'crypto' ;
  showDeposit = false;
amount: number = 0;
  user: any;
showWithdraw = false;
withdrawMethods: any[] = [];
selectedWithdrawMethod: any = null;
withdrawData: any = {};
withdrawAmount = 0;
  wallets: any[] = []; // 🔥 FIX
  selectedWallet: any = null;

  proofFile!: File;
  proofPreview: string | null = null;

  transactions: any[] = [];
openWithdraw() {
  this.showWithdraw = true;
  this.showDeposit = false;

  this.admin.getWithdrawMethods().subscribe((res: any) => {
    this.withdrawMethods = res.filter((m: any) => m.is_active);
  });
}
  ngOnInit() {
    this.userService.getMe().subscribe(user => {
      if (!user) return;
      this.user = user;
    });
  }
selectWithdrawMethod(m: any) {
  this.selectedWithdrawMethod = m;
  this.withdrawData = {};
}
submitWithdraw() {

  if (this.withdrawAmount < this.selectedWithdrawMethod.min_withdraw) {
    alert('Monto menor al mínimo');
    return;
  }

  if (this.withdrawAmount > this.selectedWithdrawMethod.max_withdraw) {
    alert('Monto mayor al máximo');
    return;
  }

  const payload = {
    methodId: this.selectedWithdrawMethod.id,
    amount: this.withdrawAmount,
    data: this.withdrawData
  };

  this.withdrawService.createWithdraw(payload).subscribe(() => {
    this.showWithdraw = false;
    this.withdrawAmount = 0;
    this.withdrawData = {};
    this.selectedWithdrawMethod = null;
  });
}
  /* ===== OPEN DEPOSIT ===== */
  openDeposit() {
    this.showDeposit = true;

    this.userService.getWallets().subscribe((res: any) => {
      this.wallets = res;
    });
  }
get calculatedFee() {
  if (!this.selectedWithdrawMethod) return 0;

  const m = this.selectedWithdrawMethod;

  return m.fee_type === 'percent'
    ? (this.withdrawAmount * m.fee) / 100
    : m.fee;
}

get netAmount() {
  return this.withdrawAmount - this.calculatedFee;
}
  /* ===== SELECT METHOD ===== */
  selectMethod(method: 'bank' | 'crypto') {
    this.method = method;

    if (method === 'crypto') {
      this.loadWallets();
    }
  }

  /* ===== LOAD WALLETS ===== */
  loadWallets() {
    this.cryptoWalletsService.getAll().subscribe((res: any) => {
      this.wallets = res;
    });
  }

  /* ===== SELECT WALLET ===== */
  selectWallet(w: any) {
    this.selectedWallet = w;
  }

  /* ===== OPEN QR MODAL ===== */
  openQr(url: string) {
    this.dialog.open(QrDialogComponent, {
      data: { url },
      width: '400px'
    });
  }

  /* ===== FILE ===== */
  onProof(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.proofFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.proofPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  /* ===== SUBMIT ===== */
submitDeposit() {
  if (!this.method) return;

  if (!this.amount || this.amount <= 0) {
    alert('Monto inválido');
    return;
  }

  if (this.method === 'crypto' && !this.selectedWallet) {
    alert('Selecciona una wallet');
    return;
  }

  const formData = new FormData();

  formData.append('method', this.method);
  formData.append('amount', this.amount.toString());

  if (this.selectedWallet) {
    formData.append('network', this.selectedWallet.network);
    formData.append('walletId', this.selectedWallet.id); // opcional
  }

  if (this.proofFile) {
    formData.append('file', this.proofFile);
  }

  this.userService.createDeposit(formData).subscribe(() => {
    Swal.fire('Éxito', 'Tu depósito ha sido registrado', 'success');

    this.showDeposit = false;
    this.amount = 0;
    this.selectedWallet = null;
    this.proofPreview = null;
  });
}
}