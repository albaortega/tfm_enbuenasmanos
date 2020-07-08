import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {AppPopupService} from "../../shared/services/app-popup/app-popup.service";
import {WorkerService} from "../../services/worker.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AppConfirmService} from "../../shared/services/app-confirm/app-confirm.service";
import {DialogData} from "../../../assets/examples/material/data-dialog/data-dialog.component";
import {FormControl, Validators} from "@angular/forms";

@Component({
    selector: 'app-conf-workers',
    templateUrl: './incorporation-date.component.html',
    styleUrls: ['./incorporation-date.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class IncorporationDateComponent implements OnInit {
    name: string;
    dni: string;
    email: string;
    phone: string;
    date: FormControl = new FormControl( '', Validators.required);
    minDate = new Date();
    constructor( private popup: AppPopupService,
                 private workerService: WorkerService,
                 private confirmService: AppConfirmService,
                 @Inject(MAT_DIALOG_DATA) public data: DialogData,
                 private dialogRef:MatDialogRef<IncorporationDateComponent>
    ) { }

    ngOnInit() {
        this.workerService.getWorkerId({id:this.data.id}).subscribe(
            worker=>{
                this.name = worker.name;
                this.dni = worker.dni;
                this.email = worker.email;
                this.phone = worker.phone;

            }, error => { console.error(error); }
        )
    }

   activeWorker(id){
        let params = {'id': id, 'delete': false, 'incorporation_date': this.date.value._d.getDate()+'/'+(this.date.value._d.getMonth()+1)+'/'+this.date.value._d.getFullYear()}
        this.confirmService.confirm({title: 'Confirmar', message: '¿Está seguro que desea dar de alta a este trabajador?'})
            .subscribe((result) => {
                if (result) {
                    if(this.date.status=='VALID')
                        this.workerService.updateWorker(params).subscribe(
                            deleted => {
                                this.dialogRef.close(deleted);
                            }, error => {
                                console.error(error);
                            }
                        )
                }
            });
    }
}
