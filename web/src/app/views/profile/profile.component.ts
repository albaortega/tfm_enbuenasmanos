import {Component,OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {UserService} from "../../services/user.service";
import {Person, Phone, Address, User} from "../../model/user.model";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {AppConfirmService} from "../../shared/services/app-confirm/app-confirm.service";
import {NewAddressComponent} from "../modals/addresses/new-address-dialog.component";
import {NewPersonComponent} from "../modals/people/new-person-dialog.component";
import {NewPhoneComponent} from "../modals/phones/new-phone-dialog.component";
import {AppPopupService} from "../../shared/services/app-popup/app-popup.service";
import {WorkerService} from "../../services/worker.service";
import {FormControl, Validators} from "@angular/forms";
import {MatCheckboxChange} from "@angular/material/checkbox";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    user: boolean = false;
    userView: boolean = true;
    worker: boolean = false;
    workerView: boolean = true;
    admin: boolean = false;
    adminView: boolean = true;
    userInfo: User;
    activeView: string = 'overview';
    name: string;
    nameInput: FormControl =  new FormControl('', Validators.required) ;
    dni: string;
    dniInput: FormControl =  new FormControl('', Validators.required) ;
    role: string;
    email: string;
    picture: string;
    worker_phone: string;
    worker_incorporation_date;
    worker_free: boolean;
    worker_accept_more_services: boolean;
    phonesList: MatTableDataSource<Phone> = new MatTableDataSource<Phone>();
    len_phoneList: number = this.phonesList.data.length;
    displayedColumnsPhones: string[] = ['number', 'action'];
    peopleList: MatTableDataSource<Person> = new MatTableDataSource<Person>();
    len_peopleList: number = this.peopleList.data.length;
    displayedColumnsPeople: string[] = ['name', 'age', 'type', 'action'];
    addressesList: MatTableDataSource<Address> = new MatTableDataSource<Address>();
    len_addressesList: number = this.addressesList.data.length;
    displayedColumnsAddresses: string[] = ['street', 'number','city','country','action'];
    editUser: boolean = false;
    editWorker: boolean = false;
    phoneInput: FormControl = new FormControl('', Validators.required);
    checkAcceptMore: FormControl = new FormControl();

    constructor(private router: ActivatedRoute,
                private userService: UserService,
                public dialog: MatDialog,
                private confirmService: AppConfirmService,
                //private loader: AppLoaderService,
                private popup: AppPopupService,
                private workerService: WorkerService) {
    }

    ngOnInit() {
        this.userService.currentUser.subscribe((user:User)=>{
            if(user){
                this.userInfo = user;
                if(user.user) this.user = true;
                if(user.worker) this.worker = true;
                if(user.admin) this.admin = true;
                this.activeView = this.router.snapshot.params['view']
                this.loadUserInfo();
                if(this.user){
                    this.loadPhones();
                    this.loadAddresses();
                    this.loadPeople();
                }
                if(this.worker){
                    this.loadWorkerInfo()
                }
            }
        });
    }

    loadUserInfo() {
        let email = this.userInfo.email;
        this.userService.getUserProfile(email).subscribe(
            (data: User) => {
                let roles = [];
                this.name = data.name;
                this.nameInput.setValue(data.name);
                this.dni = data.dni;
                this.dniInput.setValue(data.dni);
                if (data.user) roles.push('Usuario');
                if (data.worker) roles.push('Trabajador');
                if (data.admin) roles.push('Administrador');
                this.role = roles.join(', ');
                this.email = data.email;
                this.picture = data.picture;
            },
            error => {
                console.error(error);
            }
        )
    }

    loadAddresses(){
        let email = this.userInfo.email;
        let params = {'type': 'address', 'email': email}
        this.userService.getUserConfig(params).subscribe(
            (addresses: Address []) => {
                this.addressesList.data = addresses;
                this.len_addressesList= this.addressesList.data.length;
                //this.closeLoader();
            },
            error => {
                console.error(error);
            }
        );
    }

     loadPhones() {
        let email = this.userInfo.email;
        let params = {'type': 'phone', 'email': email}
        this.userService.getUserConfig(params).subscribe(
            (phones: Phone []) => {
                this.phonesList.data = phones;
                this.len_phoneList = this.phonesList.data.length;
                //this.closeLoader();
            },
            error => {
                console.error(error);
            }
        );
    }

    loadPeople() {
        let email = this.userInfo.email;
        let params = {'type': 'person', 'email': email}
        this.userService.getUserConfig(params).subscribe(
            (people: Person []) => {
                this.peopleList.data = people;
                this.len_peopleList = this.peopleList.data.length;
                //this.closeLoader();
            },
            error => {
                console.error(error);
            }
        );
    }

    loadWorkerInfo(){
        this.workerService.getWorkerId({email: this.userInfo.email}).subscribe(
            (worker)=>{
                this.worker_phone = worker.phone;
                this.worker_incorporation_date = worker.incorporation_date;
                this.worker_free = worker.free;
                this.worker_accept_more_services = worker.accept_more_services;
                this.checkAcceptMore.setValue(this.worker_accept_more_services);
            }, error=>{
                console.error(error);
            }
        );
    }


    openModalNewPhone() {
        const dialogRef = this.dialog.open(NewPhoneComponent);
        dialogRef.afterClosed().subscribe((result) => {
            if(result) {
                this.loadPhones();
                this.openPopUp('El teléfono ha sido añadido correctamente', 'success');
            }
        })
    }

    deletePhone(id: any) {
        let params = {'type': 'phone', 'id': id}
        this.confirmService.confirm({title: 'Confirmar', message: '¿Está seguro que desea eliminar el teléfono?'})
            .subscribe((result) => {
                if (result) {
                    //this.openLoader();
                    this.userService.deleteConfig(params).subscribe(
                        (data: Params) => {
                            if (data.result == 'OK') {
                                this.loadPhones();
                                this.openPopUp('El teléfono ha sido borrado correctamente','success');
                            }
                        },
                        error => {
                            console.error(error);
                        });
                }
            });
    }

    openModalNewPerson() {
        const dialogRef = this.dialog.open(NewPersonComponent, {
            width: '700px',
            data: {id:''}
        });
        dialogRef.beforeClosed().subscribe((result) => {
            if(result){
                this.loadPeople();
                this.openPopUp('La persona ha sido añadida correctamente','success');
            }
        })
    }

    editPerson(id: any) {
        const dialogRef = this.dialog.open(NewPersonComponent, {
            width: '700px',
            data: {id: id}
        });
        dialogRef.beforeClosed().subscribe((result) => {
            if(result==true) this.loadPeople();
        })
    }

    deletePerson(id: any) {
        //this.openLoader();
        let params = {'type': 'person', 'id': id}
        this.confirmService.confirm({title: 'Confirmar', message: '¿Está seguro que desea eliminar esta persona?'})
            .subscribe((result) => {
                if (result) {
                    //this.openLoader();
                    this.userService.deleteConfig(params).subscribe(
                        (data: Params) => {
                            if (data.result == 'OK'){
                                this.loadPeople();
                                this.openPopUp('La persona asistida ha sido eliminada correctamente','success');
                            }
                        },
                        error => {
                            console.error(error);
                        }
                    )
                }
        })
    }

    openModalNewAddress() {
        const dialogRef = this.dialog.open(NewAddressComponent, {
            width: '700px',
            data: {id: ''}
        });
        dialogRef.beforeClosed().subscribe((result) => {
            if(result==true){
                this.loadAddresses();
                this.openPopUp('La dirección ha sido añadida correctamente','success');
            }
        })
    }

    deleteAddress(id: any) {
        //this.openLoader();
        let params = {'type': 'address', 'id': id}
        this.confirmService.confirm({title: 'Confirmar', message: '¿Está seguro que desea eliminar esta dirección?'})
            .subscribe((result) => {
                if (result) {
                    //this.openLoader();
                    this.userService.deleteConfig(params).subscribe(
                        (data: Params) => {
                            if (data.result == 'OK'){
                                this.loadAddresses();
                                this.openPopUp('La dirección ha sido eliminada correctamente','success');
                            }
                        },
                        error => {
                            console.error(error);
                        });
                }
            });
    }

    editAdress(id: any) {
        const dialogRef = this.dialog.open(NewAddressComponent, {
            width: '700px',
            data: {id: id}
        });
        dialogRef.beforeClosed().subscribe((result) => {
            if(result==true) this.loadAddresses();
        })
    }

    /*openLoader() {
        this.loader.open();
    }
    closeLoader(){
        this.loader.close();
    }*/
    openPopUp(msg: string, type:string = ''){
        this.popup.open(msg, type);
        setTimeout(() => {
          this.popup.close();
        }, 3000)
    }

    editProfile() {
        if(this.nameInput.status=='VALID' && this.dniInput.status=='VALID') {
            let params = {
                email: this.email,
                data: {
                    name: this.nameInput.value,
                    dni: this.dniInput.value
                }
            };
            this.userService.updateProfile(params).subscribe((user: User)=>{
                this.loadUserInfo();
                this.openPopUp('Perfil editado correctamente', 'success');
            })
            this.editUser=false;
        }
    }

    savePhoneWorker() {
        if(this.phoneInput.status=='VALID'){
            let params = {
                type: 'profile',
                email: this.email,
                data: {
                    phone: this.phoneInput.value
                }
            };
            this.workerService.updateWorker(params).subscribe((worker: Worker)=>{
                this.loadWorkerInfo();
                this.openPopUp('Perfil editado correctamente', 'success');
            })
            this.editWorker = false;
        }

    }

    changeAcceptMore($event: MatCheckboxChange) {
        let params = {
                type: 'profile',
                email: this.email,
                data: {
                    accept_more_services: $event.checked
                }
            };
            this.workerService.updateWorker(params).subscribe((worker: Worker)=>{
                this.loadWorkerInfo();
                this.openPopUp('Perfil editado correctamente','success');
            })
            this.editWorker = false;
    }
}

