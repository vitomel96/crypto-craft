import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, switchMap, throwError, from } from "rxjs";
import { AuthService } from "../services/auth.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const token = authService.getToken();

  const isPublic =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/auth/google');

  console.log('➡️ REQUEST:', req.url);
  console.log('🔐 TOKEN:', token);

  // 🟢 1. REQUESTS PÚBLICAS
  if (isPublic) {
    return next(req);
  }

  // 🟢 2. SI HAY TOKEN → USARLO
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(authReq).pipe(
      catchError((error) => {
        if (error.status === 401) {
          console.log('🔄 Intentando refresh token...');

          return from(authService.fetchToken()).pipe(
            switchMap((newToken: string) => {
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`,
                },
              });

              return next(retryReq);
            }),
            catchError((err) => {
              console.error('❌ Refresh falló:', err);
              authService.clearToken();
              router.navigate(['/login']);
              return throwError(() => err);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }

  // 🔴 3. NO HAY TOKEN → INTENTAR OBTENERLO
  return from(authService.fetchToken()).pipe(
    switchMap((newToken: string) => {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${newToken}`,
        },
      });

      return next(authReq);
    }),
    catchError((error) => {
      console.error('❌ No hay token disponible:', error);
      router.navigate(['/login']);
      return throwError(() => error);
    })
  );
};