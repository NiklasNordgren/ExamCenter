import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;

  uploader: FileUploader;
  isDropOver: boolean;

  constructor() { }

  ngOnInit() {
    const headers = [{ name: 'Accept', value: 'application/json' }];
    this.uploader = new FileUploader({ url: 'localhost:9000/file/upload', autoUpload: true, headers: headers });
    this.uploader.onCompleteAll = () => alert('File uploaded');
  }

  fileOverAnother(e: any): void {
    this.isDropOver = e;
    console.log("test1");
  }

  fileClicked() {
    this.fileInput.nativeElement.click();
  }

}
