import {Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {FormControl, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../../../../assets/examples/material/data-dialog/data-dialog.component";
import {UserService} from "../../../services/user.service";
import {User} from "../../../model/user.model";

@Component({
  selector: 'new-phone-dialog',
  templateUrl: 'new-phone-dialog.html',
})
export class NewPhoneComponent implements OnInit{
  phone: FormControl = new FormControl('', Validators.required);
  userInfo: User;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              public userService: UserService,
              public dialogRef: MatDialogRef<NewPhoneComponent>) {}

      ngOnInit(): void {
        this.userService.currentUser.subscribe((user)=>{
            if(user) this.userInfo = user;
        })
      }

    savePhone() {
        let email = this.userInfo.email;
        let params = {'type':'phone','phone':this.phone.value,'email':email}
        this.userService.addConfig(params).subscribe(
            data=>{
                console.log(data);
                this.dialogRef.close(true);
            }
        );
  }
}
