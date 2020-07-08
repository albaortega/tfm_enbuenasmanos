import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ServiceService} from "../../services/service.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Service} from "../../model/service.model";
import 'rxjs/add/operator/filter';
import {DialogData} from "../../../assets/examples/material/data-dialog/data-dialog.component";
import {ServiceDetailsComponent} from "../service-details/service-details.component";
import {WorkerService} from "../../services/worker.service";
import {Worker} from "../../model/worker.model"

@Component({
    selector: 'app-solicitudes',
    templateUrl: './assign-service.component.html',
    styleUrls: ['./assign-service.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AssignServiceComponent implements OnInit {
    type: string;
    address: string;
    start_date;
    end_date;
    user: string;
    phone: string;
    client_details;
    listWorkers: Worker[];
    lenListWorkers: number;
    selected: boolean[];
    worker_selected : Worker;
    constructor( private serviceService: ServiceService,
                 public dialog: MatDialog,
                 private workerService: WorkerService,
                 @Inject(MAT_DIALOG_DATA) public data: DialogData,
                 private dialogRef : MatDialogRef<AssignServiceComponent>
    ) {}

    ngOnInit() {
        this.loadService();
    }

    loadService(){
        let params = {'id': this.data.id};
        this.serviceService.getServiceId(params).subscribe((service:Service)=>{
            this.type = service.type;
            this.address = service.address;
            this.start_date = service.start_date;
            this.end_date = service.end_date;
            this.user = service.user;
            this.phone = service.phone;
            this.client_details = service.client_details;

            this.loadWorkers();
        });
    }

    loadWorkers(){
        let params = {service: this.data.id};
        this.workerService.getWorkers(params).subscribe((workers)=>{
            this.listWorkers = workers;
            this.lenListWorkers = this.listWorkers.length;
            this.selected = new Array(this.lenListWorkers).fill(false);
        }, error => {console.error(error);})
    }

    viewDetails(id: any) {
        this.dialog.open( ServiceDetailsComponent,{
            width: '800px',
            data: {id: id}
        });
    }

    selectWorker(value, index) {
        if(value) {
            this.selected[index] = false;
            this.worker_selected = null;
        }
        else{
            this.selected.fill(false);
            this.selected[index] = true;
            this.worker_selected = this.listWorkers[index];
        }
    }

    assignWorker() {
        let params = {'id': this.data.id, 'data':{ 'status': 'assigned', 'worker': this.worker_selected.email}};
        this.serviceService.changeStatusService(params).subscribe(service=>{
            this.dialogRef.close(true);
        }, error=>{ console.error(error);})
    }
}
