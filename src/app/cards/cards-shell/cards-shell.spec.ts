import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsShell } from './cards-shell';

describe('CardsShell', () => {
  let component: CardsShell;
  let fixture: ComponentFixture<CardsShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsShell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsShell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
