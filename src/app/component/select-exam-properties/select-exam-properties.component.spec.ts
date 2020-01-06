import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectExamPropertiesComponent } from './select-exam-properties.component';

describe('SelectExamPropertiesComponent', () => {
  let component: SelectExamPropertiesComponent;
  let fixture: ComponentFixture<SelectExamPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectExamPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectExamPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
