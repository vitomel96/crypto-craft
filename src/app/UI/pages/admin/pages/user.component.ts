import { AdminService } from "../../../../infraestructure/services/admin.service";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatDialog } from "@angular/material/dialog";
import { FormsModule } from "@angular/forms";
import { NgClass, NgFor, NgIf } from "@angular/common";
import { Component } from '@angular/core';
import { KycDialog } from "./kyc-dialog/kyc-dialog";

@Component({
  standalone: true,
  selector: 'admin-users',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    NgIf,
    NgFor,
    NgClass
  ],
    templateUrl: './users.component.html'
 ,
  styles: [`
  .isActive{
    border: 1px solid #22c55e;
    border-radius: 30px;
    background-color: #22c55e;
}
    .full-width {
      width: 100%;
      background: #f5f7fa;
      color: #000;
      border-radius: 10px;
      overflow: hidden;
    }

    th {
      color:#000;
    }

    .admin {
      color: #22c55e;
      font-weight: 500;
    }

    .user {
      color: #facc15;
    }
  `]
})
export class UsersComponent {
  users: any[] = [];
  amount: any = {};
  cols = ['email', 'role', 'balance', 'kyc', 'actions'];

  constructor(private admin: AdminService, private dialog: MatDialog) {}

  ngOnInit() {
    this.admin.getUsers().subscribe((res: any) => {
      this.users = res;
    });
  }
openKyc(user: any) {
  this.admin.getKyc(user.id).subscribe((kyc: any) => {
    const dialogRef = this.dialog.open(KycDialog, {
      data: { ...kyc, id: user.id }
    });

    dialogRef.afterClosed().subscribe(() => {
 this.admin.getUsers().subscribe((res: any) => {
      this.users = res;
    });
    });
  });
}
  makeAdmin(id: string) {}
  makeUser(id: string) {}
  addBalance(id: string) {
    this.admin.addBalance(id, this.amount[id]).subscribe(() => {
      this.amount[id] = '';
      this.ngOnInit();
    });
  }
}