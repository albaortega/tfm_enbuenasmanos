import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable()
export class TokenService {

    public token: string;
    private userToken = new BehaviorSubject<string>(this.token);
    currentToken = this.userToken.asObservable();

    constructor() { }

    setToken(token: string) {
        this.userToken.next(token);
    }
}
