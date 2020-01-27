import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademyHandlerComponent } from './academy-handler.component';

describe('AcademyHandlerComponent', () => {
	let component: AcademyHandlerComponent;
	let fixture: ComponentFixture<AcademyHandlerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ AcademyHandlerComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AcademyHandlerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
