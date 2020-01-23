import { ErrorHandler, Injectable } from "@angular/core";
import { StatusMessageService } from "../service/status-message.service";
import { throwError } from 'rxjs';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
	constructor(private statusMessageService: StatusMessageService) {}

	handleError(error: Error) {
    if (!error.message.includes('route')) {
      this.statusMessageService.showErrorMessage(
        "Error",
        "An error occurred. Status code: " + error.message
      );
    } else {
      throwError(error);
    }
	}
}
