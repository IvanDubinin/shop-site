import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistHeaderComponent } from './wishlist-header.component';
import { rawWishlistMock } from '../../../../mocks/raw-entities';

describe('WishlistHeaderComponent', () => {
  let component: WishlistHeaderComponent;
  let fixture: ComponentFixture<WishlistHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WishlistHeaderComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WishlistHeaderComponent);
    component = fixture.componentInstance;
    component.wishlist = rawWishlistMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
