import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectHandlerComponent } from './subject-handler.component';

describe('SubjectHandlerComponent', () => {
	let component: SubjectHandlerComponent;
	let fixture: ComponentFixture<SubjectHandlerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ SubjectHandlerComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SubjectHandlerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
