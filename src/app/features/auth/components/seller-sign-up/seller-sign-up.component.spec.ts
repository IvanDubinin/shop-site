import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { SellerSignUpComponent } from './seller-sign-up.component';
import { UserService } from 'src/app/core/services/user.service';

describe('SignUpComponent', () => {
  let component: SellerSignUpComponent;
  let fixture: ComponentFixture<SellerSignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SellerSignUpComponent],
      imports: [HttpClientTestingModule, MatDialogModule, RouterTestingModule, MatSnackBarModule],
      providers: [UserService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
