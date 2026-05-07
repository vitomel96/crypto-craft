import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../infraestructure/services/auth.service';

@Component({
  selector: 'app-auth',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  mode: 'login' | 'register' = 'login';
  form: any;
  google: any;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  toggle(mode: 'login' | 'register') {
    this.mode = mode;
  }

  ngOnInit() {
    this.google = (window as any).google;

    this.google.accounts.id.initialize({
      client_id: '248585289023-p2j6hdr1t5arhlnjhq262gn0fcbgf6e2.apps.googleusercontent.com',
      callback: (res: any) => {
        this.loginWithGoogle(res.credential);
      },
    });

    this.google.accounts.id.renderButton(
      document.getElementById('googleBtn'),
      { theme: 'outline', size: 'large' }
    );
  }

  submit() {
    if (this.form.invalid) return;

    if (this.mode === 'login') {
      this.auth.login(this.form.value).subscribe((res: any) => {
        // 🔥 guardar sesión completa
        this.auth.saveSession(res.access_token, res.user);

        // 🔥 redirección inteligente
        if (res.user?.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/market']);
        }
      });
    } else {
      this.auth.register(this.form.value).subscribe(() => {
        this.mode = 'login';
      });
    }
  }

  loginWithGoogle(token: string) {
    this.auth.loginGoogle(token).subscribe((res: any) => {
      this.auth.saveSession(res.access_token, res.user);

      if (res.user?.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/market']);
      }
    });
  }
}