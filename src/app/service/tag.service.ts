import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tag } from '../model/tag.model';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private http: HttpClient) { }

  getTagById(id: number) {
		return this.http.get<Tag>('api/tags/' + id);
  }
  
	getAllTags() {
		return this.http.get<Tag[]>('api/tags/all');
	}

	saveTag(tag: Tag) {
		return this.http.post<Tag>('/api/tags/', tag);
  }
  
	deleteTag(id: number) {
		return this.http.delete('/api/tags/' + id);
	}
}
