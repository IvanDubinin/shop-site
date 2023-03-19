import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressBookPageComponent } from './address-book-page.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('AddressBookPageComponent', () => {
  let component: AddressBookPageComponent;
  let fixture: ComponentFixture<AddressBookPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddressBookPageComponent],
      imports: [HttpClientTestingModule, MatDialogModule, RouterTestingModule, MatSnackBarModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressBookPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
