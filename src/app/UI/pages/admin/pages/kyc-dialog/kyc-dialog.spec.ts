import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycDialog } from './kyc-dialog';

describe('KycDialog', () => {
  let component: KycDialog;
  let fixture: ComponentFixture<KycDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KycDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KycDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
