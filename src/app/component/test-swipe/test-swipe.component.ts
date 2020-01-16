import {Component, AfterViewInit, ViewChild, ViewChildren} from '@angular/core';
import { MatTabGroup, MatTab } from '@angular/material';

@Component({
	selector: 'app-test-swipe',
	templateUrl: './test-swipe.component.html',
	styleUrls: ['./test-swipe.component.scss']
})
export class TestSwipeComponent implements AfterViewInit {
		@ViewChild(MatTabGroup, {static: false}) group;
		@ViewChildren(MatTab) tabs;
		tabNum = 0;
		selected = 0;
		SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };

		number_tabs;
		ngAfterViewInit() {
				this.tabNum = this.tabs.length;
				console.log(this.group);
		}
		swipe(eType) {
				console.log(eType);
				if (eType === this.SWIPE_ACTION.LEFT && this.selected > 0) {
					console.log('movin left');
					this.selected--;
			} else if (eType === this.SWIPE_ACTION.RIGHT && this.selected < this.tabNum) {
					console.log('movin right');
					this.selected++;
			}
				console.log(this.selected);
		}

}
