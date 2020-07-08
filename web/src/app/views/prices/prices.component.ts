import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AppPopupService} from "../../shared/services/app-popup/app-popup.service";
import {WorkerService} from "../../services/worker.service";
import {MatTableDataSource} from "@angular/material/table";
import {AppConfirmService} from "../../shared/services/app-confirm/app-confirm.service";
import {PriceService} from "../../services/price.service";
import {Price} from "../../model/price.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-prices',
    templateUrl: './prices.component.html',
    styleUrls: ['./prices.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PricesComponent implements OnInit {
    editKidsPrices:boolean = false;
    editHomePrices:boolean = false;
    editHospitalPrices:boolean = false;
    kids24h;
    kids24hformcontrol: FormControl = new FormControl('',Validators.required);
    kidsweekday;
    kidsweekdayformcontrol: FormControl = new FormControl('',Validators.required);
    kidsweeknight;
    kidsweeknightformcontrol: FormControl = new FormControl('',Validators.required);
    kidsweekendday;
    kidsweekenddayformcontrol: FormControl = new FormControl('',Validators.required);
    kidsweekendnight;
    kidsweekendnightformcontrol: FormControl = new FormControl('',Validators.required);
    home24h;
    home24hformcontrol: FormControl = new FormControl('',Validators.required);
    homeweekday;
    homeweekdayformcontrol: FormControl = new FormControl('',Validators.required);
    homeweeknight;
    homeweeknightformcontrol: FormControl = new FormControl('',Validators.required);
    homeweekendday;
    homeweekenddayformcontrol: FormControl = new FormControl('',Validators.required);
    homeweekendnight;
    homeweekendnightformcontrol: FormControl = new FormControl('',Validators.required);
    hospital24h;
    hospital24hformcontrol: FormControl = new FormControl('',Validators.required);
    hospitalweekday;
    hospitalweekdayformcontrol: FormControl = new FormControl('',Validators.required);
    hospitalweeknight;
    hospitalweeknightformcontrol: FormControl = new FormControl('',Validators.required);
    hospitalweekendday;
    hospitalweekenddayformcontrol: FormControl = new FormControl('',Validators.required);
    hospitalweekendnight;
    hospitalweekendnightformcontrol: FormControl = new FormControl('',Validators.required);

    constructor( private popup: AppPopupService,
                 private workerService: WorkerService,
                 private confirmService: AppConfirmService,
                 private priceService: PriceService
    ) { }

    ngOnInit() {
        this.loadPrices();
    }

    loadPrices(){
        this.priceService.getPrices({}).subscribe((prices: Price[])=>{
            prices.forEach(price=>{
                if(price.service == "€/24 horas"){
                    this.kids24h = this.convertNumber(price.price_kids);
                    this.kids24hformcontrol.setValue(price.price_kids);
                    this.home24h = this.convertNumber(price.price_home);
                    this.home24hformcontrol.setValue(price.price_home);
                    this.hospital24h = this.convertNumber(price.price_hospital);
                    this.hospital24hformcontrol.setValue(price.price_hospital);
                }
                else if(price.service == '€/h entre semana (Diurno)'){
                    this.kidsweekday = this.convertNumber(price.price_kids);
                    this.kidsweekdayformcontrol.setValue(price.price_kids);
                    this.homeweekday = this.convertNumber(price.price_home);
                    this.homeweekdayformcontrol.setValue(price.price_home);
                    this.hospitalweekday = this.convertNumber(price.price_hospital);
                    this.hospitalweekdayformcontrol.setValue(price.price_hospital);
                }
                else if(price.service == '€/h entre semana (Nocturno)'){
                    this.kidsweeknight = this.convertNumber(price.price_kids);
                    this.kidsweeknightformcontrol.setValue(price.price_kids);
                    this.homeweeknight = this.convertNumber(price.price_home);
                    this.homeweeknightformcontrol.setValue(price.price_home);
                    this.hospitalweeknight = this.convertNumber(price.price_hospital);
                    this.hospitalweeknightformcontrol.setValue(price.price_hospital);
                }
                else if(price.service == '€/h Fin de semana (Diurno)'){
                    this.kidsweekendday = this.convertNumber(price.price_kids);
                    this.kidsweekenddayformcontrol.setValue(price.price_kids);
                    this.homeweekendday = this.convertNumber(price.price_home);
                    this.homeweekenddayformcontrol.setValue(price.price_home);
                    this.hospitalweekendday = this.convertNumber(price.price_hospital);
                    this.hospitalweekenddayformcontrol.setValue(price.price_hospital);
                }
                else if(price.service == '€/h Fin de semana (Nocturno)'){
                    this.kidsweekendnight = this.convertNumber(price.price_kids);
                    this.kidsweekendnightformcontrol.setValue(price.price_kids);
                    this.homeweekendnight = this.convertNumber(price.price_home);
                    this.homeweekendnightformcontrol.setValue(price.price_home);
                    this.hospitalweekendnight = this.convertNumber(price.price_hospital);
                    this.hospitalweekendnightformcontrol.setValue(price.price_hospital);
                }
            });
        });
    }
    convertNumber(value){
        let array = (value+'').split('.');
        if(array.length<2) array[1]='00';
        if(array[1].length<2) array[1] = array[1]+'0';
        return array;
    }

    openPopUp(msg: string, type:string = ''){
        this.popup.open(msg, type);
        setTimeout(() => {
          this.popup.close();
        }, 3000)
    }

    saveKidsPrices() {
        let params = {
            'type': 'kids',
            '24h': this.kids24hformcontrol.value,
            'weekday': this.kidsweekdayformcontrol.value,
            'weeknight': this.kidsweeknightformcontrol.value,
            'weekendday': this.kidsweekenddayformcontrol.value,
            'weekendnight': this.kidsweekendnightformcontrol.value
        };
        this.priceService.updatePrices(params).subscribe(result=>{
            this.editKidsPrices = false;
            this.loadPrices();
        });
    }
    saveHomePrices() {
        let params = {
            'type': 'home',
            '24h': this.home24hformcontrol.value,
            'weekday': this.homeweekdayformcontrol.value,
            'weeknight': this.homeweeknightformcontrol.value,
            'weekendday': this.homeweekenddayformcontrol.value,
            'weekendnight': this.homeweekendnightformcontrol.value
        };
        this.priceService.updatePrices(params).subscribe(result=>{
            this.editHomePrices = false;
            this.loadPrices();
        });
    }
    saveHospitalPrices() {
        let params = {
            'type': 'hospital',
            '24h': this.hospital24hformcontrol.value,
            'weekday': this.hospitalweekdayformcontrol.value,
            'weeknight': this.hospitalweeknightformcontrol.value,
            'weekendday': this.hospitalweekenddayformcontrol.value,
            'weekendnight': this.hospitalweekendnightformcontrol.value
        };
        this.priceService.updatePrices(params).subscribe(result=>{
            this.editHospitalPrices = false;
            this.loadPrices();
        });
    }
}
