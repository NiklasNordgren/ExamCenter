import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamNewComponent } from './exam-new.component';

describe('ExamNewComponent', () => {
  let component: ExamNewComponent;
  let fixture: ComponentFixture<ExamNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
