import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StarsComponent } from './stars.component';

describe('StarsComponent - random star count(>=1 || <=10) tests', () => {
  let component: StarsComponent;
  let fixture: ComponentFixture<StarsComponent>;
  const starCount = Math.floor(Math.random() * 10) + 1;
  const ratingPerStar = starCount / starCount;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StarsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StarsComponent);
    component = fixture.componentInstance;
    component.starsAmount = starCount;
    component.setSelfRatingOnClick = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`rating per star should be ${ratingPerStar}`, () => {
    expect(component.ratingAmountPerStar).toEqual(ratingPerStar);
  });

  it(`shoud render ${starCount} stars`, () => {
    const starsAmount =
      fixture.debugElement.nativeElement.querySelectorAll('.star-container').length;
    expect(starsAmount).toEqual(component.starsAmount);
  });
});

describe('StarComponent - 5 stars test', () => {
  let component: StarsComponent;
  let fixture: ComponentFixture<StarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StarsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StarsComponent);
    component = fixture.componentInstance;
    component.setSelfRatingOnClick = true;
    fixture.detectChanges();
  });

  it('should be rated 1,2,3,4,5 by clicking each star after another ', () => {
    const starsContainer: NodeList =
      fixture.debugElement.nativeElement.querySelectorAll('.star-container');
    const ratingStep = 1;
    let baseRating = ratingStep;
    starsContainer.forEach((star) => {
      (star as HTMLElement).click();
      fixture.detectChanges();
      expect(component.rating).toEqual(baseRating);
      baseRating += ratingStep;
    });
  });

  it('should not change rating by click', () => {
    const ratingBeforClick = component.rating;
    component.isActive = false;
    fixture.detectChanges();
    const thirdStar = fixture.debugElement.nativeElement.querySelector(
      '.star-container:nth-child(3)'
    );
    thirdStar.click();
    fixture.detectChanges();
    expect(component.rating).toEqual(ratingBeforClick);
  });
});
