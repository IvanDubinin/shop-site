import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AddressBookService } from 'src/app/core/services/addressBook.service';
import { UserService } from 'src/app/core/services/user.service';
import { MaterialModule } from 'src/app/material/material.module';

import { DeliveryAddressFormComponent } from './delivery-address-form.component';

describe('DeliveryAddressFormComponent', () => {
  let component: DeliveryAddressFormComponent;
  let fixture: ComponentFixture<DeliveryAddressFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeliveryAddressFormComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers: [UserService, AddressBookService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryAddressFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
