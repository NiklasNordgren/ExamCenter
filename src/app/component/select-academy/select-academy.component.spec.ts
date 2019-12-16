import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAcademyComponent } from './select-academy.component';

describe('SelectAcademyComponent', () => {
  let component: SelectAcademyComponent;
  let fixture: ComponentFixture<SelectAcademyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectAcademyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAcademyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
