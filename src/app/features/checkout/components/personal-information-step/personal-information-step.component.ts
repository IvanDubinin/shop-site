import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser } from '../../../../types/user.interface';
import { UserService } from '../../../../core/services/user.service';
import { PersonalInformation } from '../../../../types/checkoutSteps.interface';

@Component({
  selector: 'app-personal-information-step',
  templateUrl: './personal-information-step.component.html',
  styleUrls: ['./personal-information-step.component.scss']
})
export class PersonalInformationStepComponent {
  @Output() personalFormValue = new EventEmitter<PersonalInformation>();
  user: IUser | null;
  submitted = false;
  form: FormGroup;
  validatorsForNames = [
    Validators.required,
    Validators.minLength(2),
    Validators.pattern('[a-zA-Z ]*')
  ];
  constructor(private userService: UserService) {
    this.user = this.userService.getUser().getValue();
    this.createForm();
  }
  createForm() {
    this.form = new FormGroup({
      firstName: new FormControl(this.user?.firstName, this.validatorsForNames),
      lastName: new FormControl(this.user?.lastName, this.validatorsForNames),
      phone: new FormControl(this.user?.phoneNumber, [Validators.pattern('[- +()0-9]+')]),
      title: new FormControl(this.user?.title, [Validators.required]),
      email: new FormControl(this.user?.email, [Validators.required, Validators.email])
    });
  }

  get firstName(): FormControl {
    return this.form.get('firstName') as FormControl;
  }

  get lastName(): FormControl {
    return this.form.get('lastName') as FormControl;
  }

  get phone(): FormControl {
    return this.form.get('phone') as FormControl;
  }

  get title(): FormControl {
    return this.form.get('title') as FormControl;
  }
  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }
  onSubmit() {
    this.personalFormValue.emit(this.form.value);
    this.submitted = true;
  }
}
