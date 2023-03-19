import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartListWrapperComponent } from './cart-list-wrapper.component';

describe('CartListWrapperComponent', () => {
  let component: CartListWrapperComponent;
  let fixture: ComponentFixture<CartListWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartListWrapperComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartListWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
