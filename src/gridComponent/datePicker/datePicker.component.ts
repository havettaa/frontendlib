import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { eDateType } from '../model/enums/eDateType';

var MY_FORMATS = {
  parse: {
    dateInput: '',
  },
  display: {
    dateInput: "",
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'datePicker',
  templateUrl: './datePicker.component.html',
  styleUrls: ['./datePicker.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DatePickerComponent implements OnInit {
  @Input() properties;
  @Output() dateValue  = new EventEmitter();

  constructor(
    public dateAdapter: DateAdapter<any>,
  ) { }

  ngOnInit(): void {
    this.dateAdapter.setLocale(this.properties?.language);
    if(this.properties.type == eDateType.day){
      MY_FORMATS.display.dateInput = MY_FORMATS.parse.dateInput = this.properties.format;
    } else if (this.properties.type == eDateType.month){
      var currentFormat : string = this.properties.format.toUpperCase();
      var yearFormat = currentFormat.match(/Y+/i)[0];
      var monthFormat = currentFormat.match(/M+/)[0];
      var separator = currentFormat.match(/M[^0-9^A-Z^a-z]/)[0].substring(1,2);
      var newDateFormat : string;
      if(currentFormat.search('Y')>currentFormat.search('M')){
        newDateFormat = monthFormat + separator + yearFormat
      } else {
        newDateFormat = yearFormat + separator + monthFormat
      }
      //MY_FORMATS.display.dateInput = MY_FORMATS.parse.dateInput = newDateFormat;
    }
  }

  dateChange(value, datepicker){
    if(this.properties.type == eDateType.day){
      this.dateValue.emit(value.value?._d);
    } else if(this.properties.type == eDateType.month){
      this.dateValue.emit(value?._d);
    }
    datepicker.close();
  }

}
