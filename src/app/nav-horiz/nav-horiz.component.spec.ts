import { LayoutModule } from '@angular/cdk/layout';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { NavHorizComponent } from './nav-horiz.component';

describe('NavHorizComponent', () => {
	let component: NavHorizComponent;
	let fixture: ComponentFixture<NavHorizComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [NavHorizComponent],
			imports: [
				NoopAnimationsModule,
				LayoutModule,
				MatButtonModule,
				MatIconModule,
				MatListModule,
				MatSidenavModule,
				MatToolbarModule,
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NavHorizComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should compile', () => {
		expect(component).toBeTruthy();
	});
});
