import { Component } from '@angular/core';
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
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-shell">
      <div class="auth-card">
        <div class="brand">CRM Portal</div>
        <h1>Create your account</h1>
        <p>
          Join the CRM and start managing leads, customers, and deals in one
          place.
        </p>

        <form
          [formGroup]="registerForm"
          (ngSubmit)="onSubmit()"
          class="auth-form"
        >
          <label>
            Full name
            <input type="text" formControlName="name" placeholder="Jane Doe" />
          </label>
          <div *ngIf="isFieldInvalid('name')" class="field-error">
            {{ getFieldError('name') }}
          </div>

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
              placeholder="Create a password"
            />
          </label>
          <div *ngIf="isFieldInvalid('password')" class="field-error">
            {{ getFieldError('password') }}
          </div>

          <label>
            Confirm password
            <input
              type="password"
              formControlName="passwordConfirm"
              placeholder="Confirm your password"
            />
          </label>
          <div *ngIf="isFieldInvalid('passwordConfirm')" class="field-error">
            {{ getFieldError('passwordConfirm') }}
          </div>

          <button type="submit" [disabled]="registerForm.invalid || submitting">
            {{ submitting ? 'Creating account...' : 'Create account' }}
          </button>

          <div *ngIf="error" class="submit-error">{{ error }}</div>
        </form>

        <div class="auth-footer">
          <span>Already have an account?</span>
          <a routerLink="/auth/login">Sign in</a>
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
            circle at top left,
            rgba(16, 185, 129, 0.18),
            transparent 28%
          ),
          linear-gradient(180deg, #081724 0%, #11243f 100%);
        color: #eff6ff;
        font-family: Inter, system-ui, sans-serif;
      }

      .auth-shell {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 2rem;
      }

      .auth-card {
        width: min(520px, 100%);
        background: rgba(10, 25, 58, 0.96);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 26px;
        box-shadow: 0 30px 90px rgba(0, 0, 0, 0.26);
        padding: 2.5rem;
        backdrop-filter: blur(18px);
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
        background: linear-gradient(90deg, #14b8a6, #06b6d4);
        padding: 0.55rem 1rem;
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
        border-color: rgba(56, 189, 248, 0.8);
        transform: translateY(-0.5px);
      }

      button {
        width: 100%;
        min-height: 3rem;
        border: none;
        border-radius: 14px;
        background: linear-gradient(135deg, #14b8a6, #0ea5e9);
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
        color: #bae6fd;
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
export class RegisterComponent {
  registerForm: FormGroup;
  error: string | null = null;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { password, passwordConfirm } = this.registerForm.value;
    if (password !== passwordConfirm) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.submitting = true;
    this.error = null;

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.submitting = false;
        if (response.success) {
          this.router.navigate(['/contacts']);
        }
      },
      error: (err) => {
        this.submitting = false;
        this.error =
          err.error?.error || 'Unable to create account. Please try again.';
      },
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  getFieldError(field: string): string {
    const control = this.registerForm.get(field);
    if (!control) {
      return '';
    }

    if (control.hasError('required')) {
      return 'This field is required.';
    }

    if (control.hasError('minlength')) {
      const minLength = control.getError('minlength')?.requiredLength ?? 6;
      return `Must be at least ${minLength} characters.`;
    }

    if (control.hasError('email')) {
      return 'Please enter a valid email address.';
    }

    return '';
  }
}
