import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators, Form} from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import {Router} from "@angular/router";
import {UserService} from "../../../services/user.service";
import {AppPopupService} from "../../../shared/services/app-popup/app-popup.service";
import {User} from "../../../model/user.model";
import {AskForInfoComponent} from "../../ask-for-info/ask-for-info.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-signin2',
  templateUrl: './signin2.component.html',
  styleUrls: ['./signin2.component.scss']
})
export class Signin2Component implements OnInit {
    signUp: boolean = false;
    picture: string = '';
    signupnotfull: boolean = true;

    name: FormControl = new FormControl({value:'', disabled:true}, Validators.required);
    dni: FormControl = new FormControl({value:'',disabled:true}, Validators.required);
    email: FormControl = new FormControl({value:'',disabled:true}, Validators.required);
    agreed: FormControl = new FormControl({value:false,disabled:true}, Validators.required);

    constructor(private fb: FormBuilder,
              private router: Router,
              private userService: UserService,
              private popup: AppPopupService,
            private dialog: MatDialog) {}


    ngOnInit() {}

    login(event) {
        this.userService.getUserProfile(event.email).subscribe(user=>{
            if(user.email!=null && user.name!=null && (user.picture!=null && user.picture!='')){
                this.userService.loadUserInfo(user.email);
                this.router.navigate(['home']);
            }
            else if(user.picture == '' || user.picture == null){
                let params = {email: user.email, data:{picture: event.photoURL}};
                this.userService.updateProfile(params).subscribe((user: User)=>{
                    this.userService.loadUserInfo(user.email);
                    this.router.navigate(['home']);
                })
            }
        }, error=>{
            this.openPopUp('El usuario con el que intenta entrar no existe en el sistema, regístrese antes de continuar', 'warning');
        });
    }
    openPopUp(msg: string, type: string = ''){
        this.popup.open(msg, type);
        setTimeout(() => {
            this.popup.close();
        }, 3000)
    }

    errorLogin($event: any) {
        console.log(event);
    }

    getUser(event) {
        this.name.setValue(event.displayName);
        this.name.enable();
        this.dni.enable();
        this.email.setValue(event.email);
        this.agreed.enable();
        this.picture = event.photoURL;
        this.signupnotfull = true;
    }

    signup() {
        if(this.email.status=='VALID' && this.name.status=='VALID' && this.dni.status=='VALID' && this.picture!=''){
            let params = {
                email: this.email.value,
                name: this.name.value,
                dni: this.dni.value,
                picture: this.picture,
                user: true
            }
            if(this.agreed.value){
                this.userService.newUser(params).subscribe((user:User)=>{
                    this.userService.loadUserInfo(user.email);
                    this.router.navigate(['home']);
                })
            }
            else this.openPopUp('Debes aceptar los permisos para terminar el registro', 'warning');
        }
    }

    openAskForInfo() {
        this.dialog.open(AskForInfoComponent,{width: '50%'});

    }
}
