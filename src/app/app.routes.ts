import { Routes } from '@angular/router';
import { Auth } from './UI/pages/auth/auth';
import { MarketContainer } from './UI/pages/market-container/market-container';
import { Layout } from './UI/layout/layout';
import { Trade } from './UI/pages/trade/trade';
import { authGuard } from './UI/guards/auth-guard';
import { guestGuard } from './UI/guards/guest-guard-guard';
import { AdminGuard } from './UI/guards/admin-guard';

export const routes: Routes = [

  // 🔐 AUTH (sin layout)
  {
    path: 'auth',
    component: Auth,
    canActivate: [guestGuard],
  },

  // 🧩 APP (con layout + protegido)
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [

      {
        path: 'market',
        component: MarketContainer,
      },

      {
        path: 'profile',
        loadComponent: () =>
          import('./UI/pages/profile/profile').then(m => m.Profile)
      },

      {
        path: 'trade/:symbol',
        component: Trade
      },

      {
        path: 'wallet',
        loadComponent: () =>
          import('./UI/pages/wallet/wallet').then(m => m.Wallet)
      },

      // 🔥 ADMIN (protegido por rol)
      {
        path: 'admin',
        loadComponent: () =>
          import('./UI/pages/admin/admin').then(m => m.Admin),
        canActivate: [AdminGuard]
      },

      {
        path: '',
        redirectTo: 'market',
        pathMatch: 'full',
      }
    ]
  },

  // fallback
  {
    path: '**',
    redirectTo: 'market',
  }
];