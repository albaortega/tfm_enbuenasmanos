import {Component, ElementRef, OnInit} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-popup',
  templateUrl: './app-popup.component.html',
  styleUrls: ['./app-popup.component.scss']
})
export class AppPopupComponent implements OnInit {
  message;
  type;
  constructor(public dialogRef: MatDialogRef<AppPopupComponent>,
              public elRef: ElementRef) {}

  ngOnInit() {
    if(this.type=='success') (this.elRef.nativeElement.parentElement as HTMLElement).style.backgroundColor='#79b979';
    else if(this.type=='error') (this.elRef.nativeElement.parentElement as HTMLElement).style.backgroundColor='#e08b8b';
    else if(this.type=='warning') (this.elRef.nativeElement.parentElement as HTMLElement).style.backgroundColor='#f3bd6e';
  }

}
