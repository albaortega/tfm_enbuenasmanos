import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AppPopupComponent } from './app-popup.component';
import {DialogPosition} from "@angular/material/dialog/dialog-config";

@Injectable()
export class AppPopupService {
  dialogRef: MatDialogRef<AppPopupComponent>;
  constructor(private dialog: MatDialog) { }

  public open(msg: string, type: string): Observable<boolean> {
    this.dialogRef = this.dialog.open(AppPopupComponent, { hasBackdrop: false, position: {'top':'2%'}, panelClass: 'success'});
    this.dialogRef.updateSize('100%','80px');
    this.dialogRef.componentInstance.message = msg;
    this.dialogRef.componentInstance.type = type;
    return this.dialogRef.afterClosed();
  }

  public close() {
    if(this.dialogRef)
      this.dialogRef.close();
  }
}
