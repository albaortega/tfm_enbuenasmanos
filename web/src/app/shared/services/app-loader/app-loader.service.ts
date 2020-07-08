import {Inject, Injectable} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AppLoaderComponent } from './app-loader.component';
import {DialogData} from "../../../../assets/examples/material/data-dialog/data-dialog.component";

@Injectable()
export class AppLoaderService {
  dialogRef: MatDialogRef<AppLoaderComponent>;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dialog: MatDialog) { }

  public open(): Observable<boolean> {
    this.dialogRef = this.dialog.open(AppLoaderComponent, { disableClose: true});
    this.dialogRef.updateSize('200px');
    return this.dialogRef.afterClosed();
  }

  public close() {
    if(this.dialogRef)
      this.dialogRef.close();
  }
}
