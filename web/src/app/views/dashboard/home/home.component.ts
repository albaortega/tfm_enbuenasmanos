/// <reference types="@types/googlemaps" />

import { egretAnimations } from 'app/shared/animations/egret-animations';
import { ThemeService } from 'app/shared/services/theme.service';
import tinyColor from 'tinycolor2';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {UserService} from "../../../services/user.service";
import {Address, Person, Phone, User} from "../../../model/user.model";
import {MatDialog} from "@angular/material/dialog";
import {NewPhoneComponent} from "../../modals/phones/new-phone-dialog.component";
import {NewPersonComponent} from "../../modals/people/new-person-dialog.component";
import {NewAddressComponent} from "../../modals/addresses/new-address-dialog.component";
//import {Location, Appearance, GermanAddress} from '@angular-material-extensions/google-maps-autocomplete';
//import {} from "googlemaps";
//import PlaceResult = google.maps.places.PlaceResult;


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
    type: string = '';
    selected: boolean = false;
    personalInfo: FormGroup;
    patientInfo: FormGroup;
    addressInfo: FormGroup;
    datesInfo: FormGroup;

    //public appearance = Appearance;
    public zoom: number;
    public latitude: number;
    public longitude: number;
    //public selectedAddress: PlaceResult;
    startdate: FormControl = new FormControl( new Date());
    startminDate: Date = this.startdate.value;
    enddate: FormControl = new FormControl( new Date());
    endminDate: Date = this.enddate.value;
    openfinaldate: FormControl = new FormControl(false);
    phonesList: Phone[] = [];
    hospitalAddress: Address[] = [];
    homeAddresses: Address[] = [];
    kids: Person[] = [];
    adults: Person [] = [];
    people: Person[] = [];

    arrayPeople = [{}];
    lenarrayPeople = this.arrayPeople.length;

    constructor(
        private titleService: Title,
        private themeService: ThemeService,
        private fb: FormBuilder,
        private userService: UserService,
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.personalInfo = this.fb.group({
            name: new FormControl({value: '', disabled: true},  Validators.required),
            email: new FormControl({value:'', disabled: true},  Validators.required),
            dni: new FormControl({value: '', disabled: true}, Validators.required),
            phone: ['', Validators.required]
        });
        this.patientInfo = this.fb.group({
            user: ['', Validators.required]
        });
        this.addressInfo = this.fb.group({
            address: ['', Validators.required]
        });
        this.datesInfo = this.fb.group({
        });

        this.loadUserInfo();
        this.loadPhones();
        this.loadAddresses();
        this.loadPeople();

    }

    loadUserInfo(){
        this.userService.getUserProfile('albaortegaflores95@gmail.com').subscribe(
            (data: User)=>{
                Object.keys(data).forEach(key=>{
                    let x = {};
                    x[key] = data[key];
                    x['disabled']= true;
                    this.personalInfo.patchValue(x);
                })
            },
            error=>{console.error(error);}
        )
    }
    loadPhones(){
        let email = 'albaortegaflores95@gmail.com';
        let params = {'type': 'phone', 'email': email}
        this.userService.getUserConfig(params).subscribe(
            (phones: Phone []) => {
                this.phonesList = phones;
            },
            error => {
                console.error(error);
            }
        );
    }
    loadAddresses(){
        this.hospitalAddress = [];
        this.homeAddresses = [];
        let email = 'albaortegaflores95@gmail.com';
        let params = {'type': 'address', 'email': email}
        this.userService.getUserConfig(params).subscribe(
            (addresses: Address []) => {
                addresses.forEach((address: Address)=>{
                    if(address.type==1)  //domicilio
                        this.homeAddresses.push(address);
                    if(address.type==2)  //hospital
                        this.hospitalAddress.push(address);
                })

            },
            error => {
                console.error(error);
            }
        );
    }
    loadPeople() {
        this.kids = [];
        this.adults = [];
        this.people = [];
        let email = 'albaortegaflores95@gmail.com';
        let params = {'type': 'person', 'email': email}
        this.userService.getUserConfig(params).subscribe(
            (people: Person []) => {
                people.forEach((person: Person)=>{
                    if(person.type==1) { //infantil
                        this.kids.push(person);
                        this.people.push(person);
                    }if(person.type==2) {  //adulto
                        this.adults.push(person);
                        this.people.push(person);
                    }
                })
            },
            error => {
                console.error(error);
            }
        );
    }

    choose_service(type: string) {
        this.selected = true;
        this.type = type;
    }

    disableFinalDate(checked) {
        this.openfinaldate.setValue(checked);
    }

    newPhone() {
        const dialogRef = this.dialog.open(NewPhoneComponent);
        dialogRef.afterClosed().subscribe((result) => {
            if(result) {
                this.loadPhones();
            }
        })
    }

    newPerson() {
         const dialogRef = this.dialog.open(NewPersonComponent, {
            width: '700px',
            data: {id:''}
        });
        dialogRef.beforeClosed().subscribe((result) => {
            //if(result==true) this.loadPeople();
        })
    }

    newAddress() {
        const dialogRef = this.dialog.open(NewAddressComponent, {
            width: '700px',
            data: {id: ''}
        });
        dialogRef.beforeClosed().subscribe((result) => {
            if(result==true) this.loadPeople();
        })
    }
}
