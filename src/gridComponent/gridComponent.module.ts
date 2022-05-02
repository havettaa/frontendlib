import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './gridComponent';
import { DatePickerComponent } from './datePicker/datePicker.component';
import { GridService } from './service/grid.service';
import { GridOdataUrlBuilderService } from './urlBuilder/gridOdataUrlBuilder.service';


//material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [GridComponent, DatePickerComponent],
  imports: [
    CommonModule, 
    MatTableModule, 
    MatPaginatorModule, 
    MatFormFieldModule, 
    MatDatepickerModule,
    MatCheckboxModule,
    MatMenuModule,
    MatRadioModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule
  ],
  exports: [GridComponent, DatePickerComponent],
  providers: [GridService, GridOdataUrlBuilderService]

})
export class GridComponentModule { }
