import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@app/main/_services/authentication.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar
) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
        this.router.navigate(['/']);
    }
}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      agree: [false,  Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  openSuccessSnackBar(message: string) {
    const snackBarMatSnackBarRef = this.snackBar.open(message, 'Go to Login');

    snackBarMatSnackBarRef.onAction().subscribe(() => {
      this.router.navigate(['/login'], { relativeTo: this.route });
    });
  }

  openFailureSnackBar(message: string) {
    this.snackBar.open(message, 'Try Again');
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;
    this.authenticationService.register(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe({
          next: () => {
            this.openSuccessSnackBar('Check an email and approve your registration, please');
          },
          error: error => {
            this.openFailureSnackBar('Something was broken. Please, try again later or contact to our support.');
            this.loading = false;
          }
      });
}

test() {
  console.log('this', this.loginForm);
}

}
