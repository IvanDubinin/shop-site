import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordMatchingValidator } from '../../../../helpers/passwordMatchingValidator';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../../core/services/user.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  submitted = false;
  hide = true;
  validatorsForNames = [
    Validators.required,
    Validators.minLength(2),
    Validators.pattern('[a-zA-Z ]*')
  ];

  constructor(public dialog: MatDialog, private http: HttpClient, private userServ: UserService) {}

  form: FormGroup = new FormGroup(
    {
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&])[A-Za-z\\d!@#$%^&].{7,}'
        )
      ]),
      firstName: new FormControl('', this.validatorsForNames),
      lastName: new FormControl('', this.validatorsForNames),
      confirmPassword: new FormControl(null, [Validators.required])
    },
    { validators: passwordMatchingValidator.passwordsMatching }
  );

  get firstName(): FormControl {
    return this.form.get('firstName') as FormControl;
  }

  get lastName(): FormControl {
    return this.form.get('lastName') as FormControl;
  }

  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get confirmPassword(): FormControl {
    return this.form.get('confirmPassword') as FormControl;
  }

  changePasswordVisibility(e: Event) {
    e.preventDefault();
    this.hide = !this.hide;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.userServ
        .register({
          firstName: this.firstName.value,
          lastName: this.lastName.value,
          email: this.email.value,
          password: this.password.value,
          role: 'consumer'
        })
        .subscribe({
          next: () => {
            this.userServ.login(this.email.value, this.password.value, true).subscribe(() => {});
          },
          error: () => {
            this.form.reset();
          }
        });
    }
  }
}
