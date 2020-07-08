import {Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ServiceService} from "../../services/service.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {DialogData} from "../../../assets/examples/material/data-dialog/data-dialog.component";
import {FormControl, Validators} from "@angular/forms";
import {AppPopupService} from "../../shared/services/app-popup/app-popup.service";

@Component({
    selector: 'app-ask-for-info',
    templateUrl: './ask-for-info.component.html',
    styleUrls: ['./ask-for-info.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AskForInfoComponent implements OnInit {
    email: FormControl = new FormControl('', Validators.required);
    services: string[] = [];
    @ViewChild('serviceKids', {read: ElementRef}) serviceKids:ElementRef;
    @ViewChild('serviceHome', {read: ElementRef}) serviceHome:ElementRef;
    @ViewChild('serviceHospital', {read: ElementRef}) serviceHospital:ElementRef;

    constructor( private serviceService: ServiceService,
                 public dialog: MatDialog,
                 private route: ActivatedRoute,
                 private router: Router,
                 @Inject(MAT_DIALOG_DATA) public data: DialogData,
                 private dialogRef: MatDialogRef<AskForInfoComponent>,
                 private popup: AppPopupService,
    ) {}

    ngOnInit() {

    }

    askForInfo() {
        console.log(this.email.value);
        if(this.email.status=='VALID' && this.services.length>0){

        }
        else this.openPopUp('Debes seleccionar el correo al que mandar la información y los servicios de los que se quiere recibir','warning')
    }

    close() {
        this.dialogRef.close();
    }

     openPopUp(msg: string, type: string = ''){
        this.popup.open(msg, type);
        setTimeout(() => {
            this.popup.close();
        }, 3000)
    }

    selectService(service: string) {
        if(this['service'+service].nativeElement.classList.contains('selected')) {
            this['service' + service].nativeElement.classList.remove('selected');
            this.services.splice(this.services.indexOf(service),1);
        }
        else {
            this['service' + service].nativeElement.classList.add('selected');
            this.services.push(service);
        }
        console.log(this.services);

    }
}
