import { Injectable } from '@angular/core';
import {throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {TokenService} from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() {}

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      if (error.error.message == 'tokenExpired' || error.error.message == 'userTokenHasBeenRevoked') {
        window.location.reload();
      }
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error.message}`);
    }
    console.log(error)
    // return an observable with a user-facing error message
    return throwError(error);
  }

}
