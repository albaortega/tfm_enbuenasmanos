import { Component, OnInit } from '@angular/core';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';

@Component({
  selector: 'app-loader-dialog',
  templateUrl: './loader-dialog.component.html',
  styleUrls: ['./loader-dialog.component.css']
})
export class LoaderDialogComponent implements OnInit {
  loadingTime = 3000;
  constructor(private loader: AppLoaderService) { }

  ngOnInit() {
  }
  openLoader() {
    this.loader.open();
    setTimeout(() => {
      this.loader.close();
    }, this.loadingTime)
  }
}
