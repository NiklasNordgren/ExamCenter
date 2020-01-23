// import { Injectable } from "@angular/core";
// import {
// 	HttpInterceptor,
// 	HttpRequest,
// 	HttpHandler,
// 	HttpEvent,
// 	HttpErrorResponse
// } from "@angular/common/http";
// import { Observable } from "rxjs";
// import { retry, catchError } from "rxjs/operators";
// import { StatusMessageService } from "../service/status-message.service";

// @Injectable()
// export class ServerErrorInterceptor implements HttpInterceptor {
// 	constructor(private statusMessageService: StatusMessageService) {}

// 	intercept(
// 		request: HttpRequest<any>,
// 		next: HttpHandler
// 	): Observable<HttpEvent<any>> {
// 		return next.handle(request).pipe(
// 			retry(1),
// 			catchError((error: HttpErrorResponse) => {
// 				if (error.status === 401) {
					
// 				} else {
					
// 				}
// 			})
// 		);
// 	}
// }
