import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistPageComponent } from './wishlist-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../../../core/services/user.service';

describe('WishlistPageComponent', () => {
  let component: WishlistPageComponent;
  let fixture: ComponentFixture<WishlistPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WishlistPageComponent],
      imports: [HttpClientTestingModule, MatSnackBarModule, RouterTestingModule, MatDialogModule]
    }).compileComponents();
  });

  beforeEach(() => {
    TestBed.inject(HttpClient);
    TestBed.inject(UserService);
    fixture = TestBed.createComponent(WishlistPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
