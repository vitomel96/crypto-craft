import { Component } from '@angular/core';
import { AdminService } from '../../../../infraestructure/services/admin.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { QrDialogComponent } from './qr-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    imports: [FormsModule,MatTableModule, NgIf, MatButtonModule, MatInputModule, ReactiveFormsModule, NgFor, NgClass],
  selector: 'admin-wallets',
  templateUrl: './wallets.component.html'
})
export class WalletsComponent {
  wallets: any[] = [];
  network = '';
  address = '';
  file!: File;
cols = ['network', 'address', 'status', 'qr', 'actions'];
  constructor(private admin: AdminService, private dialog: MatDialog) {}

  ngOnInit() {
    this.load();
  }
openQr(url: string) {
  this.dialog.open(QrDialogComponent, {
    data: { url },
    width: '400px'
  });
}

  load() {
    this.admin.getWallets().subscribe((res: any) => {
      this.wallets = res;
    });
  }

  onFile(e: any) {
    this.file = e.target.files[0];
  }

  create() {
    this.admin.createWallet(
      { network: this.network, address: this.address },
      this.file
    ).subscribe(() => this.load());
  }

  activate(id: string) {
    this.admin.activateWallet(id).subscribe(() => this.load());
  }
}