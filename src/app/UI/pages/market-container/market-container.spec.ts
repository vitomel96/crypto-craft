import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketContainer } from './market-container';

describe('MarketContainer', () => {
  let component: MarketContainer;
  let fixture: ComponentFixture<MarketContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
