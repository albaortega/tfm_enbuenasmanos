import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ServiceService} from "../../services/service.service";
import {MatTableDataSource} from "@angular/material/table";
import {Service} from "../../model/service.model";
import {MatDialog} from "@angular/material/dialog";
import {DetailServiceComponent} from "../modals/detail-service/detail-service-dialog.component";
import {AppLoaderService} from "../../shared/services/app-loader/app-loader.service";
import {AppPopupService} from "../../shared/services/app-popup/app-popup.service";
import {ServiceDetailsComponent} from "../service-details/service-details.component";
import {User} from "../../model/user.model";
import {UserService} from "../../services/user.service";
import {AbstractControl, FormBuilder} from "@angular/forms";

@Component({
    selector: 'app-historial',
    templateUrl: './historial.component.html',
    styleUrls: ['./historial.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HistorialComponent implements OnInit {
    userInfo: User;
    loadingTime = 3000;
    title = 'Please wait';
    listService: MatTableDataSource<Service> = new MatTableDataSource<Service>();
    ServiceColumn: string[] = ['start_date','end_date','type', 'worker','user','address','action'];
    readonly formControl: AbstractControl;
    constructor( private serviceService: ServiceService,
                 public dialog: MatDialog,
                 //private loader: AppLoaderService,
                 private popup: AppPopupService,
                 private userService: UserService,
                 private formBuilder: FormBuilder
    ) {
        this.listService.filterPredicate = ((data, filter) => {
            filter = JSON.parse(filter);
            const a = !filter.type || data.type === filter.type;
            const b = !filter.status || data.status.toLowerCase().includes(filter.status);
            const c = !filter.text || this.userInFilter(data.user,filter.text) || data.client.toLowerCase().includes(filter.text) || data.address.toLowerCase().includes(filter.text);
            const d = !filter.start_date || this.checkStartDate(data.start_date, new Date(filter.start_date));
            const e = !filter.end_date || this.checkEndDate(data.end_date, new Date(filter.end_date));
            return a && b && c && d && e;
        }) as (Service, string) => boolean;

        this.formControl = formBuilder.group({
            type: '',
            status: '',
            start_date: '',
            end_date: '',
            text: ''

        })
        this.formControl.valueChanges.subscribe(value => {
            const filter = JSON.stringify({type: value.type.trim().toLowerCase(), status: value.status.trim().toLowerCase(), text: value.text.trim().toLowerCase(), start_date: value.start_date, end_date: value.end_date});
            this.listService.filter = filter;
        });
    }

    ngOnInit() {
        //this.openLoader();
        this.userService.currentUser.subscribe((user: User)=>{
            if(user){
                this.userInfo = user;
                this.loadServices();
            }
        });
    }

    loadServices(){
        let servicesArray = [];
        this.serviceService.getServices({'email': this.userInfo.email,'filter':'worker'}).subscribe(
            (services: Service[])=>{
                services.forEach(service=>{
                    if(service.status!='cancelled' && service.status!='assigned'){
                        servicesArray.push(service);
                    }
                });
                this.listService.data = servicesArray;
                //this.closeLoader();
            }, error => { console.error(error);}
        )
    }

    viewDetailService(id: any) {
        const dialogRef = this.dialog.open( ServiceDetailsComponent,{
            width: '800px',
            data: {id: id}
        });
        dialogRef.beforeClosed().subscribe((result) => {
            console.log(result);
            if(result==true) this.loadServices();
        })
    }


    /*openLoader() {
        this.loader.open();
    }
    closeLoader(){
        this.loader.close();
    }
     */
    openPopUp(msg: string,type:string = ''){
        this.popup.open(msg, type);
        setTimeout(() => {
          this.popup.close();
        }, 3000)
    }

        private userInFilter(users, text: any) {
        let userInText = false;
        users.forEach(user=>{
            if(user.toLowerCase().includes(text)) userInText=true;
        })
        return userInText;
    }
    private workerInFilter(worker, text: any) {
        if(worker==null) return false;
        else if(worker.toLowerCase().includes(text)) return true;
        else return false;
    }

    private checkStartDate(start_date: any, start_date_filter: any) {
        let start_date_split = start_date.split('/');
        let start_date_format = new Date(start_date_split[2],start_date_split[1]-1,start_date_split[0]);
        return start_date_format >= start_date_filter;
    }
    private checkEndDate(end_date: any, end_date_filter: any) {
        let end_date_split = end_date.split('/');
        let end_date_format = new Date(end_date_split[2],end_date_split[1]-1,end_date_split[0]);
        return end_date_format <= end_date_filter;
    }

    clearDate(event, name) {
        event.stopPropagation();
        let cleared = {}
        cleared[name] = '';
        this.formControl.patchValue(cleared);
    }
}
