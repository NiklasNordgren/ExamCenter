import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseHandlerComponent } from './course-handler.component';

describe('CourseHandlerComponent', () => {
  let component: CourseHandlerComponent;
  let fixture: ComponentFixture<CourseHandlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseHandlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
