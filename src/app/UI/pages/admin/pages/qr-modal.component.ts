import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,
  imports: [MatDialogModule],
  template: `

    <mat-dialog-content class="qr-content">
      <img [src]="data.url" class="qr-full">
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `,
  styles: [`
.qr-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.qr-full {
  width: 100%;
  max-width: 300px;
  border-radius: 10px;
  border: 1px solid #1e293b;
  background: #020617;
  padding: 10px;
}
  `]    
})
export class QrDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}