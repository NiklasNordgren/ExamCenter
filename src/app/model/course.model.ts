import { Tag } from './tag.model';

export class Course {
		id: number;
		name: string;
		courseCode: string;
		unpublished: boolean;
		subjectId: number;
		tags: Tag[];
}
