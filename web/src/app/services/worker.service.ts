import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError} from "rxjs/operators";
import {ErrorService} from "./error.service"
import {TranslateService} from "@ngx-translate/core";
import {Worker} from "../model/worker.model";
import {Params} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class WorkerService {

    constructor(
        private http: HttpClient,
        private translate: TranslateService,
        private errorService: ErrorService
    ) {
    }

    addWorker(params) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post<Worker>(environment.appURL + '/api/worker', params, httpOptions)
            .pipe(
                //retry(3), // retry a failed request up to 3 times
                catchError(this.errorService.handleError) // then handle the error
            );
    }
    getWorkers(params) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            params: params
        };
        return this.http.get<Worker[]>(environment.appURL + '/api/worker', httpOptions)
            .pipe(
                //retry(3), // retry a failed request up to 3 times
                catchError(this.errorService.handleError) // then handle the error
            );
    }
    getWorkerId(params){
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            params: params
        };
        return this.http.get<Worker>(environment.appURL + '/api/worker/id', httpOptions)
            .pipe(
                //retry(3), // retry a failed request up to 3 times
                catchError(this.errorService.handleError) // then handle the error
            );
    }
    updateWorker(params){
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            params: params
        };
        return this.http.patch<Params>(environment.appURL + '/api/worker', httpOptions)
            .pipe(
                //retry(3), // retry a failed request up to 3 times
                catchError(this.errorService.handleError) // then handle the error
            );
    }
}
