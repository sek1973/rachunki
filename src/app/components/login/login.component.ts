import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { AuthService } from './../../services/auth.service';
import { BillsFirebaseService } from './../../services/bills.firebase.service';
import { NavigationService } from './../../services/navigation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  public error = undefined;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);
  loginForm = new FormGroup({ email: this.emailFormControl, password: this.passwordFormControl });

  constructor(private authService: AuthService,
    private navigationService: NavigationService,
    private billsFirebaseService: BillsFirebaseService) { }

  ngOnInit() {
  }

  onLogIn(form: NgForm) {
    this.error = undefined;
    this.loadingSubject.next(true);
    const email = form.value.email;
    const password = form.value.password;
    this.authService.login(email, password).then(
      () => {
        this.navigationService.goToPreviousPage('/zestawienie');
        this.loadingSubject.next(false);
        console.log('logged in');
        this.billsFirebaseService.loadBills();
      },
      rejected => {
        this.error = rejected.message;
        this.loadingSubject.next(false);
        console.error(rejected);
      }
    );
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
