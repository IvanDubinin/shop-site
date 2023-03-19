import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AddressBookService } from 'src/app/core/services/addressBook.service';
import { UserService } from 'src/app/core/services/user.service';
import { MaterialModule } from 'src/app/material/material.module';

import { DeliveryAddressStepComponent } from './delivery-address-step.component';

describe('DeliveryAddressStepComponent', () => {
  let component: DeliveryAddressStepComponent;
  let fixture: ComponentFixture<DeliveryAddressStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeliveryAddressStepComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, MaterialModule],
      providers: [UserService, AddressBookService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryAddressStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
