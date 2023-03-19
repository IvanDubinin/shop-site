import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInUpModalWindowComponent } from './sign-in-up-modal-window.component';

describe('ModalWindowComponent', () => {
  let component: SignInUpModalWindowComponent;
  let fixture: ComponentFixture<SignInUpModalWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignInUpModalWindowComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInUpModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
