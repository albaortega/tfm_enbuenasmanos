import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {DialogData} from "../../../../assets/examples/material/data-dialog/data-dialog.component";
import {UserService} from "../../../services/user.service";
import {ServiceService} from "../../../services/service.service";
import {Service} from "../../../model/service.model";
import {AppLoaderService} from "../../../shared/services/app-loader/app-loader.service";

@Component({
  selector: 'detail-service-dialog',
  templateUrl: 'detail-service-dialog.html'
})
export class DetailServiceComponent implements OnInit{
    client : string;
    phone: string;
    user : string;
    address : string;
    start_date: Date;
    end_date: Date;
    open_end_date: boolean;
    status : string;
    id: string;
    worker: string;
    type: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              public serviceService: ServiceService,
              private loader: AppLoaderService) {}

  ngOnInit(): void {
      this.openLoader();
        let params = {'id': this.data.id};
        this.serviceService.getServiceId(params).subscribe(
            (data: Service)=>{
                this.client = data['client'];
                this.phone = data['phone'];
                this.user = data['user'];
                this.address = data["address"];
                this.start_date =  data['start_date'];
                this.end_date = data['end_date'];
                this.open_end_date = data['open_end_date'];
                this.status = data['status'];
                this.id = data['id'];
                this.worker = data['worker'];
                this.type = data['type'];
                this.closeLoader();
            },
            error=>{
                console.error(error);
                this.closeLoader();
                this.cerrarModal();
            }
        )
    
   }

    cerrarModal() {
      console.log('cerrar');

        return true;
    }
    openLoader() {
        this.loader.open();
    }
    closeLoader(){
        this.loader.close();
    }
}
