import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {AppPopupService} from "../../shared/services/app-popup/app-popup.service";
import {WorkerService} from "../../services/worker.service";
import {Worker} from "../../model/worker.model"
import {MatTableDataSource} from "@angular/material/table";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {NewWorkerComponent} from "../new-worker/new-worker.component";
import {AppConfirmService} from "../../shared/services/app-confirm/app-confirm.service";
import {DialogData} from "../../../assets/examples/material/data-dialog/data-dialog.component";
import {IncorporationDateComponent} from "../incorporation-date/incorporation-date.component";
import {WorkerDetailsComponent} from "../worker-details/worker-details.component";

@Component({
    selector: 'app-conf-workers',
    templateUrl: './conf-workers-inactive.component.html',
    styleUrls: ['./conf-workers-inactive.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ConfWorkersInactiveComponent implements OnInit {
    listWorkers: MatTableDataSource<Worker> = new MatTableDataSource<Worker>();
    WorkerColumns: string[] = ['picture', 'name', 'email', 'phone', 'final_date','actions'];
    constructor( private workerService: WorkerService,
                 private popup: AppPopupService,
                 private confirmService: AppConfirmService,
                 private dialog: MatDialog,
                 private dialogRef : MatDialogRef<ConfWorkersInactiveComponent>,
                 @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) { }

    ngOnInit() {
        this.loadWorkers();
    }

    loadWorkers(){
        this.listWorkers.data = this.data.list;
    }

    applyFilter($event: KeyboardEvent) {
        debugger;
        const filterValue = (event.target as HTMLInputElement).value;
        this.listWorkers.filter = filterValue.trim().toLowerCase();
    }

    openactivateWorker(id: any) {
        const dialogRef = this.dialog.open( IncorporationDateComponent,{width: '40%', data:{id: id}});
        dialogRef.afterClosed().subscribe(result=>{
            if(result != undefined){
                this.dialogRef.close(result);
            }
        })
    }

    detailsWorker(id: any) {
        const dialogRef = this.dialog.open( WorkerDetailsComponent,{width: '60%', data: {id: id}} );
    }
}
