import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { SharedMaterialModule } from 'app/shared/shared-material.module';

import { FlexLayoutModule } from '@angular/flex-layout';


import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { SessionsRoutes } from "./sessions.routing";
import { NotFoundComponent } from './not-found/not-found.component';
import { ErrorComponent } from './error/error.component';
import { Signup2Component } from './signup2/signup2.component';
import { Signup3Component } from './signup3/signup3.component';
import { Signup4Component } from './signup4/signup4.component';
import { Signin3Component } from './signin3/signin3.component';
import { Signin4Component } from './signin4/signin4.component';
import { Signin2Component } from './signin2/signin2.component';

import {FirebaseUIModule, firebase, firebaseui} from 'firebaseui-angular';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';

import {environment} from "../../../environments/environment";
import {HammerModule} from "@angular/platform-browser";

const firebaseUiAuthConfig: firebaseui.auth.Config = {
    signInFlow: 'popup',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    tosUrl: '<your-tos-link>',
    privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
    credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM
};


@NgModule({
  imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedMaterialModule,
        FlexLayoutModule,
        PerfectScrollbarModule,
        RouterModule.forChild(SessionsRoutes),
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        FirebaseUIModule.forRoot(firebaseUiAuthConfig),
        HammerModule,
        NgxAuthFirebaseUIModule.forRoot(environment.firebaseConfig)
  ],
  declarations: [ForgotPasswordComponent, LockscreenComponent, SigninComponent, SignupComponent, NotFoundComponent, ErrorComponent, Signup2Component, Signup3Component, Signup4Component, Signin3Component, Signin4Component, Signin2Component]
})
export class SessionsModule { }
