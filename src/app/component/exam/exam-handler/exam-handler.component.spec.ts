import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamHandlerComponent } from './exam-handler.component';

describe('ExamHandlerComponent', () => {
	let component: ExamHandlerComponent;
	let fixture: ComponentFixture<ExamHandlerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ExamHandlerComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ExamHandlerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
