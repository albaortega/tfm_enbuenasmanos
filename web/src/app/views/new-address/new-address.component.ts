import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../../../assets/examples/material/data-dialog/data-dialog.component";
import {UserService} from "../../services/user.service";
import PlaceResult = google.maps.places.PlaceResult;
import {User} from "../../model/user.model";

@Component({
  selector: 'new-address',
  templateUrl: 'new-address.html',
})
export class NewAddressComponent implements  OnInit{
    userInfo: User;
    addressInfo: FormGroup;
    constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              public userService: UserService,
              public fb: FormBuilder,
              public dialogRef: MatDialogRef<NewAddressComponent>) {}

    ngOnInit(): void {
        this.userService.currentUser.subscribe((user: User)=>{
            if(user) this.userInfo = user;
        })
                  this.addressInfo = this.fb.group({
                        address: [''],
                        street: ['', Validators.required],
                        number: [''],
                        portal: [''],
                        piso: [''],
                        cp: ['', Validators.required],
                        locality: ['', Validators.required],
                        city: ['', Validators.required],
                        country: ['', Validators.required],
                        aditional: [''],
                        type: ['1', Validators.required],
                        floor: [0],
                        room: [0]
                    });
                  if(this.data.id!=''){
                        let params = {'type':'address','id': this.data.id}
                        this.userService.getConfig(params).subscribe(
                            data=>{
                                Object.keys(data).forEach(key=>{
                                    let x= {}
                                    x[key] = data[key]
                                    this.addressInfo.patchValue(x)
                                })
                            },
                            error=>{
                                console.error(error);
                            }
                        )
                  }
              }

    saveAddress() {
        let email = 'albaortegaflores95@gmail.com'
        let params = {'type':'address','data':this.addressInfo.getRawValue(),'email':email}
        this.userService.addConfig(params).subscribe();
      }
      onAutocompleteSelected(result: PlaceResult) {
            let address_components = result.address_components;
            address_components.forEach(component=>{
                let types = component.types;
                if(types.indexOf('route')!=-1) this.addressInfo.patchValue({street : component.long_name});
                if(types.indexOf('street_number')!=-1) this.addressInfo.patchValue({number : component.long_name});
                if(types.indexOf('locality')!=-1) this.addressInfo.patchValue({locality : component.long_name});
                if(types.indexOf('administrative_area_level_2')!=-1)  this.addressInfo.patchValue({city : component.long_name});
                if(types.indexOf('country')!=-1) this.addressInfo.patchValue({country : component.long_name});
                if(types.indexOf('postal_code')!=-1) this.addressInfo.patchValue({cp : component.long_name});
            })
        }
        changeAddress(id) {
          if (this.addressInfo.status == 'VALID') {
              let params = {
                  'type': 'address',
                  'data': this.addressInfo.getRawValue(),
                  'email': 'albaortegaflores95@gmail.com',
                  'id': id
              }
              this.userService.updateConfig(params).subscribe();
      }
  }
}
