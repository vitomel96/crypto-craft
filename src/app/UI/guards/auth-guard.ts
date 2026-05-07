import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../infraestructure/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(AuthService);

  console.log('🛡️ GUARD CHECK:', state.url);

  if (!auth.isLoggedIn()) {
    console.log('🚫 No autenticado → redirect a /auth');
    router.navigate(['/auth']);
    return false;
  }

  if (state.url.startsWith('/admin')) {
    if (!auth.isAdmin()) {
      console.log('🚫 No es admin → redirect a /market');
      router.navigate(['/market']);
      return false;
    }
  }

  return true;
};