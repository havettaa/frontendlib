import { Injectable } from '@angular/core';
import { ColumnData } from '../model/columnsData';
import { eSortOrder } from '../model/enums/eSortOrder';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Injectable()
export class GridService {

  constructor() { }

  clearFilters(columns: ColumnData[]){
    columns.forEach(element => {
      if(element.filter != undefined){
        if(element.filter.fromTo != undefined){
          element.filter.fromTo = [null, null];
        }
        if(element.filter.text != undefined){
          element.filter.text = "";
        }
        if(element.filter.picklistValues != undefined){
          element.filter.picklistValues.length = 0;
        }
        if(element.filter.dateValue != undefined){
          element.filter.dateValue = [null, null, null]
        }
        element.filter.orderIndex = null;
        element.filter.sortOrder = eSortOrder.None;
      }
    });
  }

  setInitialFilters(columns, initialColumns) {
    columns.forEach(element => {
        const initialColumn = initialColumns.find(c => element.name == c.name);
      
        if (element.filter != undefined) {
            if (element.filter.fromTo != undefined) {
                element.filter.fromTo = [initialColumn.filter.fromTo[0], initialColumn.filter.fromTo[1]];
               
            }
            if (element.filter.text != undefined) {
                element.filter.text = initialColumn.filter.text;
               
            }
            if (element.filter.picklistValues != undefined) {
                element.filter.picklistValues.length=0 ;
            }
            if (element.filter.dateValue != undefined) {
                element.filter.dateValue = [initialColumn.filter.dateValue[0], initialColumn.filter.dateValue[1], initialColumn.filter.dateValue[2]];
            }
            element.filter.orderIndex = initialColumn.filter.orderIndex;
            element.filter.sortOrder = initialColumn.filter.sortOrder;
        }
    });
}

PicklistInitial(columns) {
  columns.forEach(element => {
    
      if (element.filter != undefined) {
         
          if (element.filter.picklistValues != undefined) {
              element.filter.picklistValues.length=0 ;
          }
         
      
      }
  });
}

  exportToExcel<T>(data: T[], fileName: string){
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelData: Blob = new Blob([excelBuffer], {});
    FileSaver.saveAs(excelData,  `${fileName}.xlsx`);
  }
}
