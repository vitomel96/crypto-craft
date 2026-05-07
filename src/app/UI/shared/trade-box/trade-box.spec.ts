import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeBox } from './trade-box';

describe('TradeBox', () => {
  let component: TradeBox;
  let fixture: ComponentFixture<TradeBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeBox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradeBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
