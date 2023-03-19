import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { IUser } from 'src/app/types/user.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-details-page',
  templateUrl: './profile-details-page.component.html',
  styleUrls: ['./profile-details-page.component.scss']
})
export class ProfileDetailsPageComponent implements OnInit, OnDestroy {
  @ViewChild('formDirective') private formDirective: NgForm;
  user: IUser | null;
  profileForm: FormGroup;
  userSubscription: Subscription;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userSubscription = this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
    this.createForm();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  createForm() {
    this.profileForm = new FormGroup({
      firstName: new FormControl(this.user?.firstName),
      lastName: new FormControl(this.user?.lastName),
      title: new FormControl(this.user?.title),
      gender: new FormControl(this.user?.gender),
      dateOfBirth: new FormControl(new Date(this.user?.dateOfBirth!)),
      phoneNumber: new FormControl(this.user?.phoneNumber, [Validators.pattern('[- +()0-9]+')]),
      email: new FormControl(this.user?.email, [Validators.required, Validators.email])
    });
  }

  get firstName(): FormControl {
    return this.profileForm.get('firstName') as FormControl;
  }
  get lastName(): FormControl {
    return this.profileForm.get('lastName') as FormControl;
  }
  get title(): FormControl {
    return this.profileForm.get('title') as FormControl;
  }
  get gender(): FormControl {
    return this.profileForm.get('gender') as FormControl;
  }
  get email(): FormControl {
    return this.profileForm.get('email') as FormControl;
  }
  get dateOfBirth(): FormControl {
    return this.profileForm.get('dateOfBirth') as FormControl;
  }
  get phoneNumber(): FormControl {
    return this.profileForm.get('phoneNumber') as FormControl;
  }

  onReset() {
    this.formDirective.resetForm(this.user);
  }

  onSubmit() {
    if (this.profileForm.valid && this.user) {
      const { firstName, lastName, title, gender, dateOfBirth, email, phoneNumber } =
        this.profileForm.getRawValue();

      Object.assign(this.user, {
        firstName,
        lastName,
        title,
        gender,
        dateOfBirth,
        email,
        phoneNumber
      });
      this.userService.updateUser(this.user!).subscribe({
        next: () =>
          this.userService.showSuccessMessage("User's profile's been successfully updated"),
        error: () => this.userService.showAndThrowError('Something went wrong. Please try again')
      });
    }
  }
}
