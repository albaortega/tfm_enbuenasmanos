import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ServiceService} from "../../services/service.service";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {Service} from "../../model/service.model";
import {Worker} from "../../model/worker.model";
import {Address, Person, User} from "../../model/user.model";
import 'rxjs/add/operator/filter';
import {DialogData} from "../../../assets/examples/material/data-dialog/data-dialog.component";

@Component({
    selector: 'app-solicitudes',
    templateUrl: './service-details.component.html',
    styleUrls: ['./service-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ServiceDetailsComponent implements OnInit {
    days: string[];
    start_date: Date;
    end_date: Date;
    open_end_date: boolean;
    type: string;
    client: string;
    phone: string;
    user: string;
    address: string;
    addressDetails: Address;
    userDetails: Person;
    clientDetails: User;
    workerDetails: Worker;
    schedule: {};
    occupation_type: string;
    constructor( private serviceService: ServiceService,
                 public dialog: MatDialog,
                 @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {}

    ngOnInit() {
        let params = {'id': this.data.id};
        this.serviceService.getServiceId(params).subscribe(
            (service: Service)=>{
                 this.start_date = service.start_date;
                 this.end_date = service.end_date;
                 this.open_end_date = service.open_end_date;
                 this.type = service.type;
                 this.client = service.client;
                 this.phone = service.phone;
                 this.user = service.user;
                 this.address = service.address;
                 this.addressDetails = service.address_details;
                 this.userDetails = service.user_details;
                 this.clientDetails = service.client_details;
                 this.workerDetails = service.worker_details;
                 this.schedule =  service.schedule;
                 this.occupation_type = service.occupation_type;
                 this.days = Object.keys(service.schedule);
                 window.scroll(0,0);
            }, error=>{ console.error(error);}
        )
    }
}
