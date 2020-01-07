import { Injectable } from "@angular/core";
import {
	HttpEvent,
	HttpRequest,
	HttpClient,
	HttpParams,
	HttpHeaders
} from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable({
	providedIn: "root"
})
export class FileService {
	constructor(private http: HttpClient) {}

	downloadFile(fileName: string): any {
		return this.http
			.get("/api/files/download/" + fileName, { responseType: "blob" })
			.pipe(map(blob => new Blob([blob], { type: "application/pdf" })));
	}

	uploadFile(file: File) {
		/*
		const formdata: FormData = new FormData();
		formdata.append('file', file);

		const req = new HttpRequest('POST', '/upload', formdata, {
			reportProgress: true,
			responseType: 'text'
		});
		*/

		const url = "/upload";

		const body = new HttpParams().set("name", file.name).set("type", file.type);

		const options = {
			headers: new HttpHeaders().set(
				"Content-Type",
				"application/x-www-form-urlencoded"
			)
		};

		this.http.post(url, body.toString(), options).subscribe(
			res => {
				console.log("POST Request was successful: " + res);
			},
			err => {
				console.log("Error occurred: " + err.toString);
			}
		);
	}
}
