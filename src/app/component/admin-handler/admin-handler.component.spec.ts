import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHandlerComponent } from './admin-handler.component';

describe('AdminHandlerComponent', () => {
	let component: AdminHandlerComponent;
	let fixture: ComponentFixture<AdminHandlerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ AdminHandlerComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdminHandlerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
