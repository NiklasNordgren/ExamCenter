import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { faPlus, faTag, faTimes } from '@fortawesome/free-solid-svg-icons';
import { SelectionModel } from '@angular/cdk/collections';
import { Tag } from 'src/app/model/tag.model';
import { TagService } from 'src/app/service/tag.service';
import { Subscription } from 'rxjs';
import { FilterPipe } from './filter.pipe';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit, OnDestroy {

  @Output() linkedTagsChange = new EventEmitter<Tag[]>();
  @Input() linkedTags: Tag[];

  subscriptions: Subscription = new Subscription();
  faPlus = faPlus;
  faTag = faTag;
  faTimes = faTimes;

  searchText = "";
  selection = new SelectionModel<Tag>(true, []);
  isNewButtonDisabled = true;
  tags: Tag[] = [];
  allTags: Tag[];
  displayedColumns: string[] = ['tagName'];
  isOnChangesDisabled = false;

  constructor(private tagService: TagService) { }

  ngOnInit() {
    this.subscriptions.add(
      this.tagService.getAllTags().subscribe(res => {
        this.tags = res;
      })
    );
  }

  ngOnChanges() {
    if (!this.isOnChangesDisabled && this.linkedTags) {
      this.linkedTags.forEach(tag => {
        this.tags = this.tags.filter(element => element.tagName != tag.tagName);
      });
      this.isOnChangesDisabled = true;
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  addToLinkedTags(tag: Tag) {
    if (!this.linkedTags.find(element => element.tagName === tag.tagName)) {    // Checks if the tag already exists in the linkedTags array
      this.tags = this.tags.filter(element => element.tagName != tag.tagName);
      this.linkedTags.push(tag);
      this.linkedTags.sort((a, b) => compare(a.tagName, b.tagName));

      this.linkedTagsChange.emit(this.linkedTags);

    }
  }

  removeFromLinkedTags(tag: Tag) {
    this.linkedTags = this.linkedTags.filter(element => element.tagName != tag.tagName);
    this.tags.push(tag);
    this.tags.sort((a, b) => compare(a.tagName, b.tagName));

    this.linkedTagsChange.emit(this.linkedTags);

  }
}

function compare(a: string, b: string) {
  var lowercaseA = a.toLocaleLowerCase();
  var lowercaseB = b.toLocaleLowerCase();
  return (lowercaseA < lowercaseB ? -1 : 1);
}
