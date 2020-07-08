import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError, retry} from "rxjs/operators";
import {ErrorService} from "./error.service"
import {TranslateService} from "@ngx-translate/core";
import {Params} from "@angular/router";
import {Service} from "../model/service.model";

@Injectable({
    providedIn: 'root'
})
export class ServiceService {

    constructor(
        private http: HttpClient,
        private translate: TranslateService,
        private errorService: ErrorService
    ) {
    }

    addService(params) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post<Service>(environment.appURL + '/api/service', params, httpOptions)
            .pipe(
                //retry(3), // retry a failed request up to 3 times
                catchError(this.errorService.handleError) // then handle the error
            );
    }
    getServices(params) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            params: params
        };
        return this.http.get<Service[]>(environment.appURL + '/api/service', httpOptions)
            .pipe(
                //retry(3), // retry a failed request up to 3 times
                catchError(this.errorService.handleError) // then handle the error
            );
    }
    changeStatusService(params){
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.patch<Service>(environment.appURL + '/api/service', params, httpOptions)
            .pipe(
                //retry(3), // retry a failed request up to 3 times
                catchError(this.errorService.handleError) // then handle the error
            );
    }
    getServiceId(params){
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            params: params
        };
        return this.http.get<Service>(environment.appURL + '/api/service/id', httpOptions)
            .pipe(
                //retry(3), // retry a failed request up to 3 times
                catchError(this.errorService.handleError) // then handle the error
            );
    }
}
