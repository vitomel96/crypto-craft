import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../infraestructure/services/user.service';
import { AsyncPipe, CurrencyPipe, NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, AsyncPipe, CurrencyPipe, ReactiveFormsModule, NgClass],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {

  form!: FormGroup;
  avatarPreview: string | null = null;

  documentFile: File | null = null;
  selfieFile: File | null = null;
documentPreview: string | null = null;
selfiePreview: string | null = null;

  loading = false;

  constructor(
    public userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userService.refreshUser();

    this.form = this.fb.group({
      firstName: [''],
      lastName: [''],
      phone: [''],
      country: [''],
    });

    // 🔥 llenar form cuando llega user
    this.userService.user$.subscribe(user => {
      if (!user) return;

      this.form.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        country: user.country,
      });
    });
  }

  // 📸 avatar preview
  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.avatarPreview = URL.createObjectURL(file);
    this.userService.uploadAvatar(file).subscribe();
  }

  // 📁 KYC files
onFile(event: any, type: 'document' | 'selfie') {
  const file = event.target.files[0];
  if (!file) return;

  // guardar archivo
  if (type === 'document') {
    this.documentFile = file;
  } else {
    this.selfieFile = file;
  }

  // 🔥 crear preview
  const reader = new FileReader();

  reader.onload = () => {
    if (type === 'document') {
      this.documentPreview = reader.result as string;
    } else {
      this.selfiePreview = reader.result as string;
    }
  };

  reader.readAsDataURL(file);
}
  // 💾 guardar perfil (te falta backend endpoint)
  saveProfile() {
    console.log(this.form.value);
    this.userService.updateProfile(this.form.value).subscribe({
      next: () => this.userService.refreshUser()
    });
  }

  // 🚀 KYC
  submitKyc() {
    if (!this.documentFile || !this.selfieFile) return;

    this.loading = true;

    this.userService.uploadKyc(this.documentFile, this.selfieFile)
      .subscribe({
        next: () => {
          this.loading = false;
          this.userService.refreshUser();
        },
        error: () => this.loading = false
      });
  }
}