import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      
    ]),
  });
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {}
  
  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      if (email && password) {
        
        this.authService.login(email, password).subscribe(
          (response) => {
            this.router.navigateByUrl('/profile');
            console.log('Login successful!');
            
          },
          (error) => {
            console.log('Authentication failed for user:', email);
            window.alert('Login Failed, Wrong Credentials');
            console.error('Login failed:', error);
            
          },
        );
      } else {
        this.markFormGroupTouched(this.loginForm);
        console.error('Email or password is missing.');
      }
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
