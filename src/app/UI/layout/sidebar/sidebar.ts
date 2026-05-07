import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../infraestructure/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, NgIf],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
isAdmin = false;
isOpen = false;

constructor(private auth: AuthService){}
toggleSidebar() {
  this.isOpen = !this.isOpen;
}
ngOnInit() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  this.isAdmin = user?.role === 'admin';
}
signOut() {
  this.auth.clearSession();  

}
}
