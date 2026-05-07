import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../infraestructure/services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const isLoggedIn = authService.isLoggedIn();

  if (!isLoggedIn) {
    console.log('✅ No autenticado → acceso permitido');
    return true;
  }
 console.log('❌ Autenticado → acceso denegado');
  router.navigate(['/market']);
  return false;
};