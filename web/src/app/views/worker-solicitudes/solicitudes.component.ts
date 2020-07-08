import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ServiceService} from "../../services/service.service";
import {Service} from "../../model/service.model";
import {MatDialog} from "@angular/material/dialog";
import {ServiceDetailsComponent} from "../service-details/service-details.component";
import {UserService} from "../../services/user.service";
import {User} from "../../model/user.model";
import {WorkerService} from "../../services/worker.service";
import {AppPopupService} from "../../shared/services/app-popup/app-popup.service";
import {AppConfirmService} from "../../shared/services/app-confirm/app-confirm.service";
import {FormControl} from "@angular/forms";

@Component({
    selector: 'app-solicitudes',
    templateUrl: './solicitudes.component.html',
    styleUrls: ['./solicitudes.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SolicitudesComponent implements OnInit {
    listServices: Service[];
    lenListServices: number;
    userInfo: User;
    checkAcceptMore: FormControl = new FormControl();
    constructor( private serviceService: ServiceService,
                 public dialog: MatDialog,
                 public userService: UserService,
                 public workerService: WorkerService,
                 private popup: AppPopupService,
                 private confirmService: AppConfirmService
                 //private loader: AppLoaderService,
    ) { }

    ngOnInit() {
        /*this.openLoader();*/
        this.userService.currentUser.subscribe(user=>{
            if(user){
                this.userInfo = user;
                this.loadServices();
                this.loadWorkerInfo();
            }
        });
    }
    loadWorkerInfo(){
        this.workerService.getWorkerId({email: this.userInfo.email}).subscribe(worker=>{
            this.checkAcceptMore.setValue(worker.accept_more_services);
        });
    }

    loadServices(){
        this.serviceService.getServices({'email': this.userInfo.email,'filter':'worker','status':'assigned','order':'asc'}).subscribe(
            (services: Service[])=>{
                this.listServices = services;
                this.lenListServices = this.listServices.length;
                //this.closeLoader();
            }, error => { console.error(error);}
        )
    }

    changeService(id: string, status: string, ask:boolean =true) {
        //this.openLoader();
        let params = {'id': id, 'data':{ 'status': status}};
        let action: string;
        let changed: string;
        if(status=='accepted'){  action =  'aceptar'; changed = 'aceptado';}
        else if(status == 'pending'){ action = 'rechazar'; changed = 'rechazado'; params.data['worker']=null; params.data['rejected_by']=this.userInfo.email}
        if(ask)
            this.confirmService.confirm({title:'Confirmar',message:'¿Está seguro que desea '+action+' este servicio?'}).subscribe(result=>{
                if(result)
                    this.serviceService.changeStatusService(params).subscribe(
                        (service: Service)=>{
                            this.loadServices();
                            this.openPopUp('Servicio ' +changed+ ' correctamente', 'success');
                        },
                        error=>{
                            console.error(error);
                            //this.closeLoader();
                        }
                    )
            });
        else this.serviceService.changeStatusService(params).subscribe(
            (service: Service)=>{
                this.loadServices();
            },
            error=>{
                console.error(error);
                //this.closeLoader();
            });
    }

    viewDetails(id: any) {
        this.dialog.open( ServiceDetailsComponent,{
            width: '800px',
            data: {id: id}
        });
    }

    changeAcceptMore(value){
        let sentence: string;
        let additional: string = '';
        if(value) sentence = 'comenzar a';
        else {
            sentence = 'dejar de';
            additional = 'Tenga en cuenta que al hacer este cambio de configuración se rechazarán todas las solicitudes pendientes';
        }
        this.confirmService.confirm({title:'Confirmar',message:'¿Está seguro que desea '+sentence+' recibir solicitudes de servicios? '+additional}).subscribe(result=>{
            if(result){
                let params = {
                    type: 'profile',
                    email: this.userInfo.email,
                    data: {
                        accept_more_services: value
                    }
                };
                this.workerService.updateWorker(params).subscribe((worker: Worker) => {
                    this.openPopUp('Configuración cambiada correctamente', 'success');
                    this.loadWorkerInfo();
                    if(value==false) this.rejectAll();
                });
            }
            else this.checkAcceptMore.setValue(!this.checkAcceptMore.value);
        })
    }

    rejectAll(){
        console.log('Debe rechazar todas las peticiones');
        this.serviceService.getServices({'email': this.userInfo.email,'filter':'worker','status':'assigned'}).subscribe((services:Service[])=>{
            services.forEach(service=>{
                this.changeService(service.id,'rejected', false);
            });
        });
    }

    openPopUp(msg: string, type: string = ''){
        this.popup.open(msg, type);
        setTimeout(() => {
          this.popup.close();
        }, 3000)
    }

}
