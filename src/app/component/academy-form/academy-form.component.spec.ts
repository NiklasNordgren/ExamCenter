import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademyFormComponent } from './academy-form.component';

describe('AcademyFormComponent', () => {
  let component: AcademyFormComponent;
  let fixture: ComponentFixture<AcademyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
