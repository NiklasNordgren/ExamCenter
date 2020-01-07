import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Navigator } from "src/app/util/navigator";

@Component({
	selector: "app-search",
	templateUrl: "./search.component.html",
	styleUrls: ["./search.component.scss"],
	providers: [Navigator]
})
export class SearchComponent implements OnInit {
	@ViewChild("searchString", { static: false }) searchString: ElementRef;

	constructor(private navigator: Navigator) {}

	ngOnInit() {}

	search() {
		let str = this.searchString.nativeElement.value;
		this.searchString.nativeElement.value = "";
		this.navigator.goToPage("/search/" + str);
	}
}