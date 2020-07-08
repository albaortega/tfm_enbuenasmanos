import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { DataDialogOverviewComponent } from './data-dialog-overview/data-dialog-overview.component';

export interface DialogData {
  id
  list
  type
}

@Component({
  selector: 'app-data-dialog',
  templateUrl: './data-dialog.component.html',
  styleUrls: ['./data-dialog.component.scss']
})
export class DataDialogComponent implements OnInit {

  constructor(public dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(DataDialogOverviewComponent, {
      data: {
        id: '',
        list: [],
        type: ''
      }
    });
  }

  ngOnInit() {
  }

}