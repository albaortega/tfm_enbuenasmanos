import { ThemeService } from 'app/shared/services/theme.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation} from '@angular/core';
import {UserService} from "../../services/user.service";
import {Address, Person, Phone, User} from "../../model/user.model";
import {MatDialog} from "@angular/material/dialog";
import {NewPhoneComponent} from "../modals/phones/new-phone-dialog.component";
import {NewPersonComponent} from "../modals/people/new-person-dialog.component";
import {NewAddressComponent} from "../modals/addresses/new-address-dialog.component";
import {ServiceService} from "../../services/service.service";
import {Service} from "../../model/service.model";
import {MatHorizontalStepper} from "@angular/material/stepper";
import {AppPopupService} from "../../shared/services/app-popup/app-popup.service";
import {Params, Router} from "@angular/router";
import {DateAdapter, MAT_DATE_FORMATS} from "@angular/material/core";
import {AppDateAdapter, APP_DATE_FORMATS} from '../date.adapter';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {provide: DateAdapter, useClass: AppDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
    ]
})
export class HomeComponent implements OnInit {
    days;
    params: Params = {
        address: {},
        client: '',
        user: [],
        phone: '',
        start_date: '',
        end_date: '',
        open_end_date: false,
        type: '',
        occupation_type: '',
        schedule: {},
        address_details: {},
        users_details: []
    };
    type: string = '';
    selected: boolean = false;
    personalInfo: FormGroup;
    patientInfo: FormGroup;
    addressInfo: FormGroup;
    datesInfo: FormGroup;
    today = new Date();
    startminDate: Date ;
    endminDate: Date ;
    openfinaldate: FormControl = new FormControl(false);
    phonesList: Phone[] = [];
    hospitalAddress: Address[] = [];
    homeAddresses: Address[] = [];
    kids: Person[] = [];
    newKids: Person[] = [];
    adults: Person [] = [];
    newAdults: Person[] = [];
    people: Person[] = [];
    newPeople: Person[] = [];
    @ViewChild('dailyMonday') dailyMonday:ElementRef;
    @ViewChild('dailyTuesday') dailyTuesday:ElementRef;
    @ViewChild('dailyWednesday') dailyWednesday:ElementRef;
    @ViewChild('dailyThursday') dailyThursday:ElementRef;
    @ViewChild('dailyFriday') dailyFriday:ElementRef;
    @ViewChild('dailySaturday') dailySaturday:ElementRef;
    @ViewChild('dailySunday') dailySunday:ElementRef;
    daily: FormControl = new FormControl(false);
    hourly: FormControl = new FormControl(false);
    monday_start: FormControl = new FormControl('', Validators.required);
    monday_end: FormControl = new FormControl('', Validators.required);
    tuesday_start: FormControl = new FormControl('', Validators.required);
    tuesday_end: FormControl = new FormControl('', Validators.required);
    wednesday_start: FormControl = new FormControl('', Validators.required);
    wednesday_end: FormControl = new FormControl('', Validators.required);
    thursday_start: FormControl = new FormControl('', Validators.required);
    thursday_end: FormControl = new FormControl('', Validators.required);
    friday_start: FormControl = new FormControl('', Validators.required);
    friday_end: FormControl = new FormControl('', Validators.required);
    saturday_start: FormControl = new FormControl('', Validators.required);
    saturday_end: FormControl = new FormControl('', Validators.required);
    sunday_start: FormControl = new FormControl('', Validators.required);
    sunday_end: FormControl = new FormControl('', Validators.required);

  private fieldArray: Array<any> = [];
  userInfo: User;

    constructor(
        private themeService: ThemeService,
        private fb: FormBuilder,
        private userService: UserService,
        public dialog: MatDialog,
        public serviceService: ServiceService,
        public renderer: Renderer2,
        private popup: AppPopupService,
        private router: Router,
        //private loader: AppLoaderService
    ) { }

    ngOnInit() {
        //this.openLoader()
        let min = this.today;
        this.startminDate = new Date(min.setDate(min.getDate()+1));
        this.endminDate = this.startminDate;

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
            start_date: new FormControl( '', Validators.required),
            end_date: new FormControl( '', Validators.required),
            open_end_date: [false]
        });

        this.userService.currentUser.subscribe((user:User)=>{
            if(user){
                this.userInfo = user;
                this.loadUserInfo();
                this.loadPhones();
                this.loadAddresses();
                this.loadPeople();
            }
        });
    }

    loadUserInfo(){
        this.userService.getUserProfile(this.userInfo.email).subscribe(
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
        let email = this.userInfo.email;
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
        let email = this.userInfo.email;
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
        let email = this.userInfo.email;
        let params = {'type': 'person', 'email': email}
        this.userService.getUserConfig(params).subscribe(
            (people: Person []) => {
                people.forEach((person: Person)=>{
                    if(person.type==1) { //infantil
                        this.kids.push(person);
                        this.newKids.push(person);
                        this.people.push(person);
                        this.newPeople.push(person);
                    }if(person.type==2) {  //adulto
                        this.adults.push(person);
                        this.newAdults.push(person);
                        this.people.push(person);
                        this.newPeople.push(person);
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
            if(result==true) this.loadPeople();
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
    addFieldValue(type: string) {
        this.fieldArray.push(this.patientInfo.getRawValue().user)
        let list;
        let newList;
        if(type=='infantil') {
            list = this.kids;
            newList = this.newKids;
        }
        if(type=='adultos'){
            list = this.adults;
            newList = this.newAdults;
        }
        if(type=='todos'){
            list = this.people;
            newList = this.newPeople;
        }
        list.forEach(person=>{
            if(this.fieldArray.indexOf(person.id)!=-1){
                let index = list.indexOf(person);
                newList.splice(index,1);
            }
        });
  }

  deleteFieldValue(index) {
        let id = this.fieldArray[index];
        this.fieldArray.splice(index, 1);
        this.kids.forEach(kid=>{
             if(kid.id == id){
                 this.newKids.push(kid);
             }
            }
        );
  }

    createService(type: string) {
        //this.openLoader();

        let params = this.createParams(type);

        this.serviceService.addService(params).subscribe(
            (service:Service)=>{
                this.openPopUp('Servicio pedido correctamente','success');
                this.router.navigate(['historial']);
            }, error=>{
                console.error(error);
                this.openPopUp('Ha ocurrido un error al crear el servicio', 'error');
            });
    }

    createParams(type: string){
        let params = {};
        params['client'] = this.personalInfo.getRawValue().email;
        params['phone'] = this.personalInfo.getRawValue().phone;
        params['address'] =  this.addressInfo.getRawValue().address;
        let start_date = this.datesInfo.getRawValue().start_date;
        params['start_date'] = start_date.getDate()+'/'+(start_date.getMonth()+1)+'/'+start_date.getFullYear()
        let end_date = this.datesInfo.getRawValue().end_date;
        params['end_date'] = end_date.getDate()+'/'+(end_date.getMonth()+1)+'/'+end_date.getFullYear()
        params['open_end_date'] = this.datesInfo.getRawValue().open_end_date;
        params['type'] = type;
        params['user'] = this.fieldArray;
        if(this.daily.value){
            params['occupation_type'] = 'daily'
            let days = this.getDaysSelected();
            let schedule = {};
            days.forEach(day=>{
                schedule[day] = true;
            })
            params['schedule'] = schedule;

        }
        else if(this.hourly.value){
            params['occupation_type'] = 'hourly'
            let days = this.getDaysSelected();
            let schedule = {}
            days.forEach(day=>{
                schedule[day]={start: this[day+'_start'].value, end: this[day+'_end'].value}
            })
            params['schedule'] = schedule;
        }
        return params;
    }
    checkDaily(day) {
        if(this['daily'+day].nativeElement.classList.contains('dailyselected'))
            this['daily'+day].nativeElement.classList.remove('dailyselected');
        else
            this['daily'+day].nativeElement.classList.add('dailyselected');
    }

    goNext(stepper: MatHorizontalStepper,type: string) {
        if(type == 'user'){
            if(this.fieldArray.length==0) this.openPopUp('Hay que seleccionar un usuario', 'warning');
            else stepper.next();
        }
        else if(type == 'dates'){
            if(!this.daily.value && !this.hourly.value) this.openPopUp('Hay que seleccionar un tipo de servicio','warning');
            else if(this.daily.value){
                if(this.checkDaysSelected()) {
                    this.loadSummary();
                    stepper.next();
                }
                else this.openPopUp('Hay que seleccionar al menos un día','warning');
            }
            else if(this.hourly.value){
                if(this.checkDaysSelected()){
                    let next = this.checkHoursCompleted();
                    if(next) {
                        this.loadSummary();
                        stepper.next();
                    }
                    else{
                        this.openPopUp('Debes seleccionar el horario para los días seleccionados','warning');
                    }
                }
                else this.openPopUp('Hay que seleccionar al menos un día','warning')
            }
        }
    }
    loadSummary(){
        let params = this.createParams('');
        this.params = params;
        let addressParams = {type: 'address', id: params['address']}
        this.userService.getConfig(addressParams).subscribe((address)=>{
             this.params['address_details'] = address;
        });
        let users = [];
        params['user'].forEach(user=>{
            let userParams = { type: 'person', id:user};
            this.userService.getConfig(userParams).subscribe((user)=>{
                users.push(user);
            });
            this.params['users_details'] = users;
        });
        console.log(this.params.schedule);
        let days = Object.keys(this.params.schedule);
        this.days = days;

    }

    checkDaysSelected(){
        return !(!this.dailyMonday.nativeElement.classList.contains('dailyselected') && !this.dailyTuesday.nativeElement.classList.contains('dailyselected')
            && !this.dailyWednesday.nativeElement.classList.contains('dailyselected') && !this.dailyThursday.nativeElement.classList.contains('dailyselected')
            && !this.dailyFriday.nativeElement.classList.contains('dailyselected') && !this.dailySaturday.nativeElement.classList.contains('dailyselected')
            && !this.dailySunday.nativeElement.classList.contains('dailyselected'));
    }
    getDaysSelected(){
        let selected = [];
        if(this.dailyMonday.nativeElement.classList.contains('dailyselected')) selected.push('monday');
        if(this.dailyTuesday.nativeElement.classList.contains('dailyselected')) selected.push('tuesday');
        if(this.dailyWednesday.nativeElement.classList.contains('dailyselected')) selected.push('wednesday');
        if(this.dailyThursday.nativeElement.classList.contains('dailyselected')) selected.push('thursday');
        if(this.dailyFriday.nativeElement.classList.contains('dailyselected')) selected.push('friday');
        if(this.dailySaturday.nativeElement.classList.contains('dailyselected')) selected.push('saturday');
        if(this.dailySunday.nativeElement.classList.contains('dailyselected')) selected.push('sunday');
        return selected;

    }
    checkHoursCompleted(){
        let next = true;
        if(this.dailyMonday.nativeElement.classList.contains('dailyselected') && next)
            if(this.monday_start.status!='VALID' || this.monday_end.status!='VALID') next = false;
        if(this.dailyTuesday.nativeElement.classList.contains('dailyselected') && next)
            if(this.tuesday_start.status!='VALID' || this.tuesday_end.status!='VALID') next = false;
        if(this.dailyWednesday.nativeElement.classList.contains('dailyselected') && next)
            if(this.wednesday_start.status!='VALID' || this.wednesday_end.status!='VALID') next = false;
        if(this.dailyThursday.nativeElement.classList.contains('dailyselected') && next)
            if(this.thursday_start.status!='VALID' || this.thursday_end.status!='VALID') next = false;
        if(this.dailyFriday.nativeElement.classList.contains('dailyselected') && next)
            if(this.friday_start.status!='VALID' || this.friday_end.status!='VALID') next = false;
        if(this.dailySaturday.nativeElement.classList.contains('dailyselected') && next)
            if(this.saturday_start.status!='VALID' || this.saturday_end.status!='VALID') next = false;
        if(this.dailySunday.nativeElement.classList.contains('dailyselected') && next)
            if(this.sunday_start.status!='VALID' || this.sunday_end.status!='VALID') next = false;

        return next;
    }

    openPopUp(msg: string, type: string = ''){
        this.popup.open(msg, type);
        setTimeout(() => {
          this.popup.close();
        }, 3000)
    }

    changeEndDate() {
        let start = this.datesInfo.getRawValue().start_date;
        this.endminDate = new Date( start.setDate(start.getDate()+1));
    }

}
