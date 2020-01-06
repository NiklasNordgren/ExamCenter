import { Component, OnInit } from "@angular/core";
import { Navigator } from "src/app/util/navigator";

@Component({
	selector: "app-search",
	templateUrl: "./search.component.html",
	styleUrls: ["./search.component.scss"],
	providers: [Navigator]
})
export class SearchComponent implements OnInit {
	constructor(private navigator: Navigator) {}

	ngOnInit() {}

	search(searchString: string) {
		this.navigator.goToPage("/search/" + searchString);
	}
}
