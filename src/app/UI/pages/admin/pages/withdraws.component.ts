import { DecimalPipe, NgClass, NgFor, NgIf } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { WithdrawalsService } from "../../../../infraestructure/services/withdrawals.service";

 @Component({
    selector: 'admin-withdraws',
    templateUrl: './withdraws.component.html',
    styleUrl: '../admin.css',
    imports: [
        FormsModule,
        NgFor,
        NgIf,
        MatTableModule,
        MatButtonModule,
        MatInputModule,
        NgClass,
        DecimalPipe
    ]
 })
 export class WithdrawsComponent {
    constructor(private withdrawalsService: WithdrawalsService) {}

    ngOnInit() {
        this.loadWithdrawals();
    }
    
    cols = ['user', 'amount', 'method', 'status', 'actions'];
    withdrawals: any[] = [];

loadWithdrawals() {
  this.withdrawalsService.getAllWithdrawals()
    .subscribe(res => this.withdrawals = res);
}

updateStatus(id: string, status: 'approved' | 'rejected') {

  if (status === 'rejected') {
    const confirmReject = confirm('¿Seguro que quieres rechazar y devolver el dinero?');
    if (!confirmReject) return;
  }

  this.withdrawalsService.updateWithdrawStatus(id, status)
    .subscribe({
      next: () => {
        this.loadWithdrawals();
      },
      error: (err) => {
        alert(err.error?.message || 'Error');
      }
    });
}
 }