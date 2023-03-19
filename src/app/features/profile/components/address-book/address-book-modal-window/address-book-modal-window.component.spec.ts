import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AddressBookModalWindowComponent } from './address-book-modal-window.component';

describe('AddressBookModalWindowComponent', () => {
  let component: AddressBookModalWindowComponent;
  let fixture: ComponentFixture<AddressBookModalWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddressBookModalWindowComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: { data: {} } }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressBookModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
