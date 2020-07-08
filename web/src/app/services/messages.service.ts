import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError, retry} from "rxjs/operators";
import {ErrorService} from "./error.service"
import {TranslateService} from "@ngx-translate/core";
import {Message} from "../model/message.model";

@Injectable({
    providedIn: 'root'
})
export class MessagesService {

    constructor(
        private http: HttpClient,
        private translate: TranslateService,
        private errorService: ErrorService
    ) {
    }

    getMessages(params) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            params: params
        };
        return this.http.get<Message[]>(environment.appURL + '/api/message', httpOptions)
            .pipe(
                //retry(3), // retry a failed request up to 3 times
                catchError(this.errorService.handleError) // then handle the error
            );
    }
    newMessage(params){
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post<Message>(environment.appURL + '/api/message', params, httpOptions)
            .pipe(
                //retry(3), // retry a failed request up to 3 times
                catchError(this.errorService.handleError) // then handle the error
            );
    }

}
