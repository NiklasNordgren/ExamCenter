import { Component, OnInit, OnDestroy } from "@angular/core";
import { SearchService } from "src/app/service/search.service";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
	selector: "app-search-result",
	templateUrl: "./search-result.component.html",
	styleUrls: ["./search-result.component.scss"]
})
export class SearchResultComponent implements OnInit, OnDestroy {
	subscriptions: Subscription = new Subscription();
	searchString: string;
	searchResult;

	constructor(
		private searchService: SearchService,
		private activatedRoute: ActivatedRoute
	) {}

	ngOnInit() {
		this.activatedRoute.params.subscribe(params => {
			this.searchString = params["searchString"];
			this.search(this.searchString);
		});
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	search(searchText: string) {
		this.subscriptions.add(
			this.searchService
				.searchForSubjectsAndCourses(searchText)
				.subscribe(result => {
					this.searchResult = result;
					console.log(JSON.stringify(this.searchResult));
				})
		);
	}
}
