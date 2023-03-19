import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleForViewModeComponent } from './toggle-for-view-mode.component';

describe('ToggleForViewModeComponent', () => {
  let component: ToggleForViewModeComponent;
  let fixture: ComponentFixture<ToggleForViewModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToggleForViewModeComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleForViewModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
