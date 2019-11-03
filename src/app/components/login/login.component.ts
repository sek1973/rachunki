import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);
  loginForm = new FormGroup({ email: this.emailFormControl, password: this.passwordFormControl });

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onLogIn(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.authService.login(email, password);
    this.router.navigate(['/zestawienie']);
  }

  getErrorMessage(formControl: FormControl): string {
    let errorMsg = '';
    if (formControl.errors) {
      formControl.errors.array.forEach(err => {
        errorMsg += err;
      });
    }
    return errorMsg;
  }
}
