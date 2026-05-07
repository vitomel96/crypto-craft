import { Component } from '@angular/core';
import { AdminService } from "../../../../infraestructure/services/admin.service";
import { DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { QrDialogComponent } from './qr-modal.component';

@Component({
  selector: 'admin-deposits',
  templateUrl: './deposits.component.html',
  standalone: true,
  imports: [DecimalPipe, NgFor,NgIf, NgClass, MatTableModule, MatButtonModule, MatInputModule, MatDialogModule, FormsModule]
})
export class DepositsComponent {
  deposits: any[] = [];
cols = ['user', 'amount', 'proof', 'network', 'status', 'actions'];
  constructor(private admin: AdminService, private dialog: MatDialog) {}

openProof(url: string) {
  this.dialog.open(QrDialogComponent, {
    data: { url },
    width: '400px'
  });
}
  ngOnInit() {
    this.admin.getDeposits().subscribe((res: any) => {
      this.deposits = res;
    });
  }

  approve(id: string) {
    this.admin.approveDeposit(id).subscribe(() => this.ngOnInit());
  }

  reject(id: string) {
    this.admin.rejectDeposit(id).subscribe(() => this.ngOnInit());
  }
}