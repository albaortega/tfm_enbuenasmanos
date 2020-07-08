import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ChartsModule } from 'ng2-charts';
import { FileUploadModule } from 'ng2-file-upload';
import { SharedPipesModule } from 'app/shared/pipes/shared-pipes.module';

import { NewPhoneComponent } from './phones/new-phone-dialog.component'
import {MatDialogModule} from "@angular/material/dialog";
import {MatTableModule} from "@angular/material/table";
import {CdkTableModule} from "@angular/cdk/table";
import {MatSelectModule} from "@angular/material/select";
import {MatGoogleMapsAutocompleteModule} from '@angular-material-extensions/google-maps-autocomplete';
import {AgmCoreModule} from "@agm/core";
import {NewPersonComponent } from './people/new-person-dialog.component';
import {NewAddressComponent} from "./addresses/new-address-dialog.component";
import {DetailServiceComponent} from "./detail-service/detail-service-dialog.component";

@NgModule({
  imports: [
      AgmCoreModule.forRoot({
          apiKey: 'AIzaSyCkKT-KqqWR3So4fomnc8Zb_74pNW36nmY',
          libraries: ['places']
        }),
    MatGoogleMapsAutocompleteModule,
    CommonModule,
    FormsModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatChipsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatInputModule,
    MatProgressBarModule,
    FlexLayoutModule,
    NgxDatatableModule,
    ChartsModule,
    FileUploadModule,
    SharedPipesModule,
    MatDialogModule,
    MatTableModule,
    CdkTableModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  declarations: [NewPhoneComponent, NewPersonComponent, NewAddressComponent, DetailServiceComponent]
})
export class ProfileModule { }
