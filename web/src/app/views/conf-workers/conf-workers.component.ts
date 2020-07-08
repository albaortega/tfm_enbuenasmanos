import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AppPopupService} from "../../shared/services/app-popup/app-popup.service";
import {WorkerService} from "../../services/worker.service";
import {Worker} from "../../model/worker.model"
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {NewWorkerComponent} from "../new-worker/new-worker.component";
import {AppConfirmService} from "../../shared/services/app-confirm/app-confirm.service";
import {ConfWorkersInactiveComponent} from "../conf-workers-inactive/conf-workers-inactive.component";
import {WorkerDetailsComponent} from "../worker-details/worker-details.component";
import {UserService} from "../../services/user.service";
import {User} from "../../model/user.model";

@Component({
    selector: 'app-conf-workers',
    templateUrl: './conf-workers.component.html',
    styleUrls: ['./conf-workers.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ConfWorkersComponent implements OnInit {
    listWorkers: MatTableDataSource<Worker> = new MatTableDataSource<Worker>();
    ServiceColumn: string[] = [ 'picture','name', 'email', 'phone', 'actions'];
    listAdmins: MatTableDataSource<User> = new MatTableDataSource<User>();
    AdminColumn: string[] = [ 'picture','name', 'email','dni', 'actions'];
    inactiveWorkers: Worker[] = [];
    constructor( private popup: AppPopupService,
                 private workerService: WorkerService,
                 private dialog: MatDialog,
                 private confirmService: AppConfirmService,
                 private userService: UserService
    ) { }

    ngOnInit() {
        this.loadWorkers();
        this.loadAdmins();
    }

    loadWorkers() {
        let activeWorkers = [];
        this.inactiveWorkers = [];
        this.workerService.getWorkers({}).subscribe(
            (workers: Worker[]) => {
                workers.forEach(worker => {
                    if (worker.status == 'working') activeWorkers.push(worker);
                    else if (worker.status == 'not working') this.inactiveWorkers.push(worker);
                })
                this.listWorkers.data = activeWorkers;
            }, error => {
                console.error(error);
            }
        );
    }
    loadAdmins(){
        this.userService.getAdmins({}).subscribe((admins: User[])=>{
            this.listAdmins.data = admins;
        });
    }

    openPopUp(msg: string, type: string = ''){
        this.popup.open(msg, type);
        setTimeout(() => {
          this.popup.close();
        }, 3000)
    }

    newWorkers() {
        const dialogRef = this.dialog.open( NewWorkerComponent,{width: '60%', data: {id: '', type: 'worker'}} );
        dialogRef.afterClosed().subscribe(result=>{
            if(result!= "") {
                this.openPopUp('Trabajador '+result+' creado correctamente', 'success');
                this.loadWorkers();
            }
        })
    }
    newAdmin() {
        const dialogRef = this.dialog.open( NewWorkerComponent,{width: '40%', data: {id: '', type: 'admin'}} );
        dialogRef.afterClosed().subscribe(result=>{
            if(result!= "") {
                this.openPopUp('Administrador '+result+' creado correctamente', 'success');
                this.loadWorkers();
            }
        })
    }

    editWorker(id){
        const dialogRef = this.dialog.open( NewWorkerComponent,{width: '60%', data: {id: id, type:'worker'}} );
        dialogRef.afterClosed().subscribe(result=>{
            if(result!= "") {
                this.openPopUp('Trabajador '+result+' editado correctamente', 'success');
                this.loadWorkers();
            }
        })
    }

    deleteWorker(id: string) {
        let params = {'id': id, 'delete': true }
        this.confirmService.confirm({title: 'Confirmar', message: '¿Está seguro que desea dar de baja a este trabajador?'})
            .subscribe((result) => {
                if (result) {
                    this.workerService.updateWorker(params).subscribe(
                        deleted => {
                            this.openPopUp('Trabajador eliminado correctamente','success');
                            this.loadWorkers();
                        }, error => {
                            console.error(error);
                        }
                    )
                }
            });
    }

    viewInactiveWorkers() {
        const dialogRef = this.dialog.open( ConfWorkersInactiveComponent,{width: '90%', data: {id: '', list: this.inactiveWorkers}} );
        dialogRef.afterClosed().subscribe(result=>{
            if(result!= ""){
                this.loadWorkers();
                this.openPopUp(result.name +' dado de alta correctamente','success');
            }
        })
    }

    applyFilter($event: KeyboardEvent) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.listWorkers.filter = filterValue.trim().toLowerCase();
    }

    detailsWorker(id: any) {
        this.dialog.open( WorkerDetailsComponent,{width: '60%', data: {id: id}} );
    }

    deleteAdmin(email: string) {
        this.confirmService.confirm({title: 'Confirmar', message: '¿Está seguro que desea eliminar este administrador?'}).subscribe((result) => {
            if (result) {
                let params = {email: email, data: {admin: false}}
                this.userService.updateProfile(params).subscribe(response => {
                    this.loadAdmins();
                });
            }
        });
    }
}
