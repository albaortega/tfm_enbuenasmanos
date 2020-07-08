import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import 'rxjs/add/operator/filter';
import {DialogData} from "../../../assets/examples/material/data-dialog/data-dialog.component";
import {FormControl, Validators} from "@angular/forms";
import {WorkerService} from "../../services/worker.service";
import {Worker} from "../../model/worker.model";
import {MatSelect} from "@angular/material/select";
import {UserService} from "../../services/user.service";
import {User} from "../../model/user.model";

@Component({
    selector: 'app-new-worker',
    templateUrl: './new-worker.component.html',
    styleUrls: ['./new-worker.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NewWorkerComponent implements OnInit {
    type: string = 'worker';
    name: FormControl = new FormControl('', Validators.required);
    email: FormControl = new FormControl('', Validators.required);
    dni: FormControl = new FormControl('', Validators.required);
    phone: FormControl = new FormControl('', Validators.required);
    date: FormControl = new FormControl('', Validators.required);
    minDate = new Date();
    services: FormControl = new FormControl([], Validators.required);
    servicesArray = [{id: 'infantil', viewValue: 'Infantil'},
        {id: 'domicilio', viewValue: 'Domicilio'},
        {id: 'hospital', viewValue:'Hospital'}];
    constructor( @Inject(MAT_DIALOG_DATA) public data: DialogData,
                 private workerService: WorkerService,
                 private dialogRef:MatDialogRef<NewWorkerComponent>,
                 private userService: UserService
    ) {}

    ngOnInit() {
        if(this.data.id!='') {
            if(this.data.type=='worker') {
                this.workerService.getWorkerId({'id': this.data.id}).subscribe(
                    (worker: Worker) => {
                        console.log(worker);
                        this.name.setValue(worker.name);
                        this.email.setValue(worker.email);
                        this.email.disable();
                        this.dni.setValue(worker.dni);
                        this.phone.setValue(worker.phone);
                        this.date.setValue(new Date(worker.incorporation_date));
                        this.date.disable();
                        this.services.setValue(worker.type);
                    }, error => {
                        console.error(error);
                    }
                )
            }
            else if(this.data.type=='admin'){
                this.userService.getUserProfile(this.data.id).subscribe(
                    (user: User)=>{
                        console.log(user);
                    }
                )
            }
        }

    }
    saveWorker() {
        let params = {
            data_user: {
                name: this.name.value,
                email: this.email.value,
                dni: this.dni.value,
                worker: true,
                picture: ''},
            data_worker: {
                type: this.services.value,
                email: this.email.value,
                phone: this.phone.value,
                incorporation_date: this.date.value._d.getDate()+'/'+(this.date.value._d.getMonth()+1)+'/'+this.date.value._d.getFullYear()}
        }
        if(this.name.status=="VALID" && this.email.status=="VALID" && this.dni.status=="VALID" &&
            this.services.status=="VALID" && this.phone.status=="VALID" && this.date.status=="VALID" ){
                this.workerService.addWorker(params).subscribe(
                (worker: Worker)=>{
                    this.dialogRef.close(worker.name);
                }, error => { console.error(error); }
            )
        }
    }

    updateWorker(id: string) {
        let params = {
            id: id,
            data_user: {
                name: this.name.value,
                dni: this.dni.value},
            data_worker: {
                phone: this.phone.value,
                type: this.services.value
        }};
        if(this.name.status=="VALID" && this.email.status=="DISABLED" && this.dni.status=="VALID" && this.services.status=="VALID" &&
            this.phone.status=="VALID" && this.date.status=="DISABLED" && this.services.status=='VALID' ) {
            this.workerService.updateWorker(params).subscribe(
                (updated) => {
                    this.dialogRef.close(updated.name);
                }, error => {
                    console.error(error);
                }
            );
        }
    }

    selectAllServices(select: MatSelect, servicesArray) {
        select.value = servicesArray;
        let selected = [];
        servicesArray.forEach(service=> selected.push(service.id));
        this.services.setValue(selected);
    }
    saveAdmin(){
        if(this.email.status=='VALID' && this.dni.status=='VALID' && this.name.status=='VALID'){
            let params = {
                email: this.email.value,
                dni: this.dni.value,
                name: this.name.value,
                admin: true,
                picture: ''
            }
            this.userService.newUser(params).subscribe((user: User)=>{
                console.log(user);
                this.dialogRef.close(user.name);
            });
        }
    }
    updateAdmin(email){
        if(this.email.status=='VALID' && this.dni.status=='VALID' && this.name.status=='VALID'){
            let params = {
                dni: this.dni.value,
                name: this.name.value
            }
            this.userService.updateProfile(params).subscribe((user: User)=>{
                console.log(user);
                this.dialogRef.close(user.name);
            });
        }
    }
}
