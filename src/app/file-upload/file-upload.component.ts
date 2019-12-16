import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { faUpload, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ExamService } from '../service/exam.service';
import { Exam } from '../model/exam.model';

const headers = [{ name: 'Accept', value: 'application/json' }];

export interface FileTableItem {
  tempFileId: number;
  name: string;
  size: string;
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  exam: Exam = {
    name:"testUrl",
    date: "2019-12-09",
    pdfUrl: "http://testUrl",
    courseId: 5,
    unpublishDate: "2022-12-09",
    unpublished: false
  }

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  uploader: FileUploader = new FileUploader(
    {
      //url: 'http://localhost:9000/file/upload',
      url: 'api/files/upload',
      autoUpload: false,
      headers,
      allowedMimeType: ['application/pdf']
    }
  );

  tempFileId = 1;
  isFileOverDropZone = false;
  accentColor = 'accent';
  mode = 'determinate';
  faUpload = faUpload;
  faTrash = faTrash;
  dataSource: FileTableItem[] = [];
  displayedColumns: string[] = ['name', 'size', 'actions'];

  constructor(private examService: ExamService) { }

  ngOnInit() {

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      file.index = this.tempFileId;
      this.dataSource = this.dataSource.concat({ tempFileId: this.tempFileId, name: file.file.name, size: Math.round(file.file.size / 1000) + 'kB' });
      this.tempFileId++;
      console.log('Succesfully added file: ' + file.file.name + ' to the queue.');
    };

    this.uploader.onWhenAddingFileFailed = (file) => {
      console.log('Failed to add file: ' + file.name + ' to the queue.');
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('Item:' + item);
      console.log("Status:" + status);
      console.log("Response:" + response);

      if(status == 200)
        this.examService.saveExam(this.exam).subscribe(e => {
          console.log(e);
        });
    };

  }

  fileOverDropZone(e: any): void {
    this.isFileOverDropZone = e;
  }

  fileClicked() {
    this.fileInput.nativeElement.click();
  }

  clearQueue() {
    this.uploader.clearQueue();
    this.dataSource = [];
  }

  uploadFromQueue(element: any) {
    this.uploader.queue.find(x => x.index === element.tempFileId).upload();
  }

  removeFromQueue(element: any) {

    for (let i = 0; i < this.uploader.queue.length; i++) {
      if (this.uploader.queue[i].index === element.tempFileId) {
        this.uploader.queue[i].remove();
      }
    }

    this.dataSource = this.dataSource.filter(x => {
      return x.tempFileId !== element.tempFileId;
    });

  }

  isUploadedFromQueue(element: any) {
    return this.uploader.queue.find(x => x.index === element.tempFileId) ? true : false;
  }

}
