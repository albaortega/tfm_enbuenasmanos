import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError, retry} from "rxjs/operators";
import {ErrorService} from "./error.service"
import {TranslateService} from "@ngx-translate/core";
import {Params} from "@angular/router";
import {Service} from "../model/service.model";
import {Price} from "../model/price.model";
import {Chat} from "../model/chat.model";

@Injectable({
    providedIn: 'root'
})
export class ChatsService {

    constructor(
        private http: HttpClient,
        private translate: TranslateService,
        private errorService: ErrorService
    ) {
    }

    getChats(params) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            params: params
        };
        return this.http.get<Chat[]>(environment.appURL + '/api/chat', httpOptions)
            .pipe(
                //retry(3), // retry a failed request up to 3 times
                catchError(this.errorService.handleError) // then handle the error
            );
    }

}
