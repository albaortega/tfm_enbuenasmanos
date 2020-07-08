import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError, retry} from "rxjs/operators";
import {ErrorService} from "./error.service"
import {Phone, User, UserInfo} from "../model/user.model"
import {TranslateService} from "@ngx-translate/core";
//import {Choice} from "../model/choices.model";
import {Params} from "@angular/router";
import {Worker} from "../model/worker.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    public userInfo: User;
    private userSource = new BehaviorSubject<User>(this.userInfo);
    currentUser = this.userSource.asObservable();

    public userRoles : User[];
    private userSourceRoles = new BehaviorSubject<User[]>(this.userRoles);
    currentUserRoles = this.userSourceRoles.asObservable();

    constructor(
        private http: HttpClient,
        private translate: TranslateService,
        private errorService: ErrorService
    ) { }

    getUserProfile(email){
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            params: {'email': email}
        };
        return this.http.get<User>(environment.appURL + '/api/user/info', httpOptions)
            .pipe(
                //retry(3), // retry a failed request up to 3 times
                catchError(this.errorService.handleError) // then handle the error
            );
    }

    addConfig(params){
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post<Params>(environment.appURL + '/api/user/config', params, httpOptions)
            .pipe(
                //retry(3), // retry a failed request up to 3 times
                catchError(this.errorService.handleError) // then handle the error
            );
    }
    updateConfig(params){
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.patch<Params>(environment.appURL + '/api/user/config', params, httpOptions)
            .pipe(
                //retry(3), // retry a failed request up to 3 times
                catchError(this.errorService.handleError) // then handle the error
            );
    }
    deleteConfig(params){
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            params: params
        };
        return this.http.delete<Params>(environment.appURL + '/api/user/config', httpOptions)
            .pipe(
                //retry(3), // retry a failed request up to 3 times
                catchError(this.errorService.handleError) // then handle the error
            );
    }
    getUserConfig(params){
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            params: params
        };
        return this.http.get<Params[]>(environment.appURL + '/api/user/config', httpOptions)
            .pipe(
                //retry(3), // retry a failed request up to 3 times
                catchError(this.errorService.handleError) // then handle the error
            );
    }
    getConfig(params){
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            params: params
        };
        return this.http.get<Params[]>(environment.appURL + '/api/user/config/id', httpOptions)
            .pipe(
                //retry(3), // retry a failed request up to 3 times
                catchError(this.errorService.handleError) // then handle the error
            );
    }

    loadUserInfo(email) {
        this.getUserProfile(email).subscribe(
            data => { this.setUserInfo(data);},
            error => this.errorService.handleError(error)
        );
    }


    setUserInfo(user: User) {
        this.userSource.next(user);
        this.translate.use(user.language);
    }

    logoutUserInfo() {
        this.userSource.next(new User());
    }

    newUser(params){
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post<User>(environment.appURL + '/api/user', params, httpOptions)
            .pipe(
                //retry(3), // retry a failed request up to 3 times
                catchError(this.errorService.handleError) // then handle the error
            );
    }
    updateProfile(params){
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.patch<Params>(environment.appURL + '/api/user/info', params, httpOptions)
            .pipe(
                //retry(3), // retry a failed request up to 3 times
                catchError(this.errorService.handleError) // then handle the error
            );
    }

    getAdmins(params){
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            params: params
        };
        return this.http.get<Params[]>(environment.appURL + '/api/user/admin', httpOptions)
            .pipe(
                //retry(3), // retry a failed request up to 3 times
                catchError(this.errorService.handleError) // then handle the error
            );
    }


}
