import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ServiceService} from "../../services/service.service";
import {Service} from "../../model/service.model";
import {MatDialog} from "@angular/material/dialog";
import {ServiceDetailsComponent} from "../service-details/service-details.component";
import {AssignServiceComponent} from "../assign-service/assign-service.component";
import {AppPopupService} from "../../shared/services/app-popup/app-popup.service";

@Component({
    selector: 'app-solicitudes',
    templateUrl: './solicitudes.component.html',
    styleUrls: ['./solicitudes.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SolicitudesComponent implements OnInit {
    listServices: Service[];
    lenListServices: number;
    constructor( private serviceService: ServiceService,
                 public dialog: MatDialog,
                 private popup: AppPopupService,
    ) { }

    ngOnInit() {
        this.loadServices();
    }


    loadServices(){
        this.serviceService.getServices({'status':'pending', 'order': 'asc'}).subscribe(
            (services: Service[])=>{
                this.listServices = services;
                this.lenListServices = this.listServices.length;
            }, error => { console.error(error);}
        )
    }

    viewDetails(id: any) {
        const dialogRef = this.dialog.open( ServiceDetailsComponent,{
            width: '800px',
            data: {id: id}
        });
    }

    assignWorker(id: string) {
        const dialogRef = this.dialog.open(AssignServiceComponent,{
            width: '90%',
            data: {id: id}
        });
        dialogRef.afterClosed().subscribe(result=>{
            if(result){
                this.loadServices();
                this.openPopUp('Servicio asignado a un trabajador','success');
            }
        })
    }

    openPopUp(msg: string, type: string = ''){
        this.popup.open(msg,type);
        setTimeout(() => {
          this.popup.close();
        }, 3000)
    }
}
