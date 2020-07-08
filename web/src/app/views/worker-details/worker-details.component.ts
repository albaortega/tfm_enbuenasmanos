import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import 'rxjs/add/operator/filter';
import {DialogData} from "../../../assets/examples/material/data-dialog/data-dialog.component";
import {WorkerService} from "../../services/worker.service";
import {Worker} from "../../model/worker.model";

@Component({
    selector: 'app-worker-details',
    templateUrl: './worker-details.component.html',
    styleUrls: ['./worker-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class WorkerDetailsComponent implements OnInit {
    name: string;
    email: string;
    dni: string;
    phone: string;
    incorporation_date: Date;
    final_date: Date;
    status: string;
    free: boolean;
    services: string;
    picture: string;
    constructor( @Inject(MAT_DIALOG_DATA) public data: DialogData,
                 private workerService: WorkerService
    ) {}

    ngOnInit() {
        this.workerService.getWorkerId({'id':this.data.id}).subscribe(
            (worker: Worker)=>{
                this.name = worker.name;
                this.services = worker.type;
                this.email = worker.email;
                this.dni = worker.dni;
                this.phone = worker.phone;
                this.incorporation_date = worker.incorporation_date;
                this.final_date = worker.final_date;
                this.status = worker.status;
                this.free = worker.free;
                this.picture = worker.picture;
            }, error => { console.error(error); }
        )

    }
}
