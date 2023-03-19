import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewItemCardComponent } from './review-item-card.component';
import { reviewLong, reviewShort } from '../../../../../mocks/constucted-entities';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../../../../types/user.interface';
import { rawUserMock } from '../../../../../mocks/raw-entities';
import { UserService } from '../../../../core/services/user.service';
import { SharedModule } from '../../../../shared/shared.module';

class MockUserService {
  getUser(): BehaviorSubject<IUser> {
    return new BehaviorSubject<IUser>(rawUserMock);
  }
}

describe('ReviewItemCardComponent', () => {
  let component: ReviewItemCardComponent;
  let fixture: ComponentFixture<ReviewItemCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewItemCardComponent],
      imports: [SharedModule],
      providers: [{ provide: UserService, useClass: MockUserService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewItemCardComponent);
    component = fixture.componentInstance;
    component.review = reviewLong;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('if comment too long the button "Read more"', () => {
    it('should appear - logic', () => {
      expect(component.canShowMoreOrLess).toBeTrue();
    });
    it('should appear - dom', () => {
      const button = fixture.nativeElement.querySelector('button.read-more');
      expect(button.textContent).toContain('Read more');
    });
    it('should appear at the closed state initially', () => {
      expect(component.isCommentShownFull).toBeFalse();
    });
    it('should appear at the opened state after click on it - logic', () => {
      const button = fixture.nativeElement.querySelector('button.read-more');
      button.click();
      expect(component.isCommentShownFull).toBeTrue();
    });
    it('should appear at the opened state after click on it - dom', () => {
      const button = fixture.nativeElement.querySelector('button.read-more');
      button.click();
      fixture.detectChanges();
      expect(button.textContent).toContain('Read less');
    });
    it('should appear again at the closed state after 2 clicks on it', () => {
      component.onMoreOrLessClick();
      component.onMoreOrLessClick();
      expect(component.isCommentShownFull).toBeFalse();
    });
  });

  describe('if comment length is less that maximum', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ReviewItemCardComponent);
      component = fixture.componentInstance;
      component.review = reviewShort;
      fixture.detectChanges();
    });
    it('the button "Read more" should not appear', () => {
      expect(component.canShowMoreOrLess).toBeFalse();
    });
  });

  describe('should show as a comment author', () => {
    it('anonymous', () => {
      const expectedName = 'Anonymous';

      const name = fixture.nativeElement.querySelector('.title');
      expect(name.textContent).toContain(expectedName);
    });
    it('or the user first and last name', () => {
      const expectedName = `${rawUserMock.firstName} ${rawUserMock.lastName}`;

      fixture = TestBed.createComponent(ReviewItemCardComponent);
      component = fixture.componentInstance;
      component.review = reviewShort;
      fixture.detectChanges();

      const name = fixture.nativeElement.querySelector('.title');
      expect(name.textContent).toContain(expectedName);
    });
  });
});
