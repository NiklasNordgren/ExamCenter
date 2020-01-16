import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationAckDialogComponent } from './confirmation-ack-dialog.component';

describe('ConfirmationErrorDialogComponent', () => {
  let component: ConfirmationAckDialogComponent;
  let fixture: ComponentFixture<ConfirmationAckDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationAckDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationAckDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
