import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavHorizComponent } from './nav-horiz.component';

describe('NavHorizComponent', () => {
  let component: NavHorizComponent;
  let fixture: ComponentFixture<NavHorizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavHorizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavHorizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
