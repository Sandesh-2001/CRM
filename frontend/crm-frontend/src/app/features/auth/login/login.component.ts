import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-shell">
      <div class="auth-card">
        <div class="brand">CRM Portal</div>
        <h1>Welcome back</h1>
        <p>Sign in to manage your contacts and stay productive.</p>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <label>
            Email
            <input
              type="email"
              formControlName="email"
              placeholder="you@example.com"
            />
          </label>
          <div *ngIf="isFieldInvalid('email')" class="field-error">
            {{ getFieldError('email') }}
          </div>

          <label>
            Password
            <input
              type="password"
              formControlName="password"
              placeholder="Enter your password"
            />
          </label>
          <div *ngIf="isFieldInvalid('password')" class="field-error">
            {{ getFieldError('password') }}
          </div>

          <button type="submit" [disabled]="loginForm.invalid || submitting">
            {{ submitting ? 'Signing in...' : 'Sign in' }}
          </button>

          <div *ngIf="error" class="submit-error">{{ error }}</div>
        </form>

        <div class="auth-footer">
          <span>New here?</span>
          <a routerLink="/auth/register">Create an account</a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background:
          radial-gradient(
            circle at top right,
            rgba(102, 126, 234, 0.16),
            transparent 28%
          ),
          linear-gradient(180deg, #0c1b33 0%, #142544 100%);
        color: #eef2ff;
        font-family: Inter, system-ui, sans-serif;
      }

      .auth-shell {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 2rem;
        background:
          radial-gradient(
            circle at top left,
            rgba(127, 90, 240, 0.14),
            transparent 24%
          ),
          radial-gradient(
            circle at bottom right,
            rgba(59, 130, 246, 0.12),
            transparent 20%
          ),
          linear-gradient(180deg, #0b172f 0%, #141d39 100%);
      }

      .auth-card {
        width: min(480px, 100%);
        background: rgba(12, 23, 52, 0.96);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 28px;
        box-shadow: 0 35px 90px rgba(0, 0, 0, 0.32);
        padding: 2.75rem;
        backdrop-filter: blur(24px);
      }

      .brand {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        letter-spacing: -0.03em;
        color: #ffffff;
        margin-bottom: 1rem;
        font-size: 1.1rem;
        text-transform: uppercase;
        background: linear-gradient(90deg, #7f5af0, #a78bfa);
        padding: 0.5rem 1rem;
        border-radius: 999px;
        width: fit-content;
      }

      h1 {
        font-size: clamp(2rem, 2.5vw, 2.5rem);
        margin: 0.75rem 0 0.5rem;
        letter-spacing: -0.04em;
      }

      p {
        margin: 0;
        color: #cbd5e1;
        line-height: 1.7;
        margin-bottom: 2rem;
      }

      .auth-form {
        display: grid;
        gap: 1rem;
      }

      label {
        display: grid;
        gap: 0.5rem;
        color: #e2e8f0;
        font-size: 0.95rem;
      }

      input {
        width: 100%;
        min-height: 3rem;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.14);
        background: rgba(255, 255, 255, 0.06);
        color: #f8fafc;
        padding: 0 1rem;
        transition:
          border-color 0.2s ease,
          transform 0.2s ease;
      }

      input:focus {
        outline: none;
        border-color: rgba(99, 102, 241, 0.8);
        transform: translateY(-0.5px);
      }

      button {
        width: 100%;
        min-height: 3rem;
        border: none;
        border-radius: 14px;
        background: linear-gradient(135deg, #7f5af0, #c084fc);
        color: white;
        font-size: 1rem;
        font-weight: 700;
        cursor: pointer;
        transition:
          transform 0.2s ease,
          filter 0.2s ease;
      }

      button:hover:not(:disabled) {
        transform: translateY(-1px);
        filter: brightness(1.05);
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .field-error,
      .submit-error {
        color: #fecaca;
        font-size: 0.92rem;
        line-height: 1.4;
      }

      .auth-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1.5rem;
        color: #94a3b8;
      }

      .auth-footer a {
        color: #c7d2fe;
        text-decoration: none;
        font-weight: 700;
      }

      .auth-footer a:hover {
        text-decoration: underline;
      }

      @media (max-width: 520px) {
        .auth-card {
          padding: 1.75rem;
        }
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error: string | null = null;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = null;

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.submitting = false;
        if (response.success) {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.submitting = false;
        this.error =
          err.error?.error || 'Unable to sign in. Please check your details.';
      },
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  getFieldError(field: string): string {
    const control = this.loginForm.get(field);
    if (!control) {
      return '';
    }

    if (control.hasError('required')) {
      return 'This field is required.';
    }

    if (control.hasError('email')) {
      return 'Please enter a valid email address.';
    }

    if (control.hasError('minlength')) {
      return 'Password must be at least 6 characters.';
    }

    return '';
  }
}
