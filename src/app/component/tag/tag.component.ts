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

  selection = new SelectionModel<Tag>(true, []);
  isNewButtonDisabled = true;
  tags: Tag[] = [];
  allTags: Tag[];
  displayedColumns: string[] = ['tagName'];

  constructor(private tagService: TagService) { }

  ngOnInit() {
    this.subscriptions.add(
      this.tagService.getAllTags().subscribe(res => {
        this.tags = res;
      })
    );
  }

  ngOnChanges() {
    if (this.linkedTags) {
      console.log("now");

      this.linkedTags.forEach(tag => {
        this.tags = this.tags.filter(element => element.tagName != tag.tagName);
      });

    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  addToLinkedTags(tag: Tag) {
    if (!this.linkedTags.find(element => element.tagName === tag.tagName)) {    // Checks if the tag already exists in the linkedTags array

      const index = this.tags.indexOf(tag);
      console.log(tag);
      
      if (index > -1) {   // -1 if not found
        this.tags.splice(index, 1);

       
        console.log("add");
        
        console.log(this.tags);

    //    this.tags.sort((a, b) => compare(a.tagName.toLocaleLowerCase + "", b.tagName.toLocaleLowerCase + ""));

        this.linkedTags.push(tag);
        this.linkedTagsChange.emit(this.linkedTags);
      }
    }
  }

  removeFromLinkedTags(tag: Tag) {
    const index = this.linkedTags.indexOf(tag);
    if (index > -1) {   // -1 if not found
      this.linkedTags.splice(index, 1);
      this.tags.push(tag);

      console.log("delete");
      
      console.log(this.tags);

   //   this.tags.sort((a, b) => compare(a.tagName.toLocaleLowerCase + "", b.tagName.toLocaleLowerCase + ""));

      this.linkedTagsChange.emit(this.linkedTags);
    }
  }
}

function compare(a: string, b: string) {
  const isAsc = true;
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
