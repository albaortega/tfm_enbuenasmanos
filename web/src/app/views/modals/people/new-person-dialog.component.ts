import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../../../../assets/examples/material/data-dialog/data-dialog.component";
import {UserService} from "../../../services/user.service";
import {User} from "../../../model/user.model";

@Component({
  selector: 'new-person-dialog',
  templateUrl: 'new-person-dialog.html'
})
export class NewPersonComponent implements OnInit{
  patientInfo: FormGroup;
  userInfo: User;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              public userService: UserService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<NewPersonComponent>) {}

  ngOnInit(): void {
      this.userService.currentUser.subscribe(user=>{
          if(user) this.userInfo = user;
      })
    this.patientInfo = this.fb.group({
            name: ['', Validators.required],
            age: [0, Validators.required],
            type: [0, Validators.required],
            disability: [0],
            desc_disability: [''],
            dependence: [0],
            pattern: [''],
            observations: ['']
        });
    if(this.data.id!=''){
        let params = {'type':'person','id': this.data.id}
        console.log(params);
        this.userService.getConfig(params).subscribe(
            data=>{
                console.log(data);
                Object.keys(data).forEach(key=>{
                    let x= {}
                    x[key] = data[key]
                    this.patientInfo.patchValue(x)
                })
            },
            error=>{
                console.error(error);
            }
        )
    }
   }

  savePerson() {
      if(this.patientInfo.status == 'VALID'){
          let params = {'type':'person','data': this.patientInfo.getRawValue(),'email':this.userInfo.email}
          this.userService.addConfig(params).subscribe(user=>{
              this.dialogRef.close(true);
          });
      }

  }
  changePerson(id) {
      if (this.patientInfo.status == 'VALID') {
          let params = {
              'type': 'person',
              'data': this.patientInfo.getRawValue(),
              'email': this.userInfo.email,
              'id': id
          }
          this.userService.updateConfig(params).subscribe(user=>{
              this.dialogRef.close(true);
          });
      }
  }
}
