import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarWrapperComponent } from './star-wrapper.component';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

describe('StarWrapperComponent', () => {
  let component: StarWrapperComponent;
  let fixture: ComponentFixture<StarWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StarWrapperComponent],
      imports: [MatDialogModule],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: { data: { productId: 5, rating: 5 } } }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StarWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
