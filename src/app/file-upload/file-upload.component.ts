import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { FileUploader } from 'ng2-file-upload';

const headers = [{ name: 'Accept', value: 'application/json' }];

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  public uploader: FileUploader = new FileUploader({ url: 'http://localhost:9000/file/upload', autoUpload: true, headers: headers });;
  isDropOver: boolean;

  constructor() { }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('FileUpload:uploaded:', item, status, response);
      alert('File uploaded successfully');
    };
  }

  fileOverAnother(e: any): void {
    this.isDropOver = e;
  }

  fileClicked() {
    this.fileInput.nativeElement.click();
  }

}
