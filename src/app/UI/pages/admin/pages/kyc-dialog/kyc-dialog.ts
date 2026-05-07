import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AdminService } from '../../../../../infraestructure/services/admin.service';
import { NgClass, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-kyc-dialog',
  imports: [MatDialogModule, MatButton, NgIf, KycDialog, NgClass],
  templateUrl: './kyc-dialog.html',
  styleUrl: './kyc-dialog.css',
})
export class KycDialog {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<KycDialog>,
    private admin: AdminService
  ) {}

  approve() {
    this.admin.updateKyc(this.data.id, 'approved')
      .subscribe(() => this.dialogRef.close(true));
  }

  reject() {
    this.admin.updateKyc(this.data.id, 'rejected')
      .subscribe(() => this.dialogRef.close(true));
  }
}
