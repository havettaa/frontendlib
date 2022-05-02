import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { gridText } from './gridText';
import { ColumnData } from './model/columnsData';
import { PaginatorData } from './model/paginatorData';
import { SelectedData } from './model/selectedData';
import { eSortOrder } from './model/enums/eSortOrder';
import { eDateType } from './model/enums/eDateType';
import { ActionGridEvent } from './model/events/actionGridEvent';
import { PaginatorGridEvent } from './model/events/paginatorGridEvent';
import { FilterGridEvent } from './model/events/filterGridEvent';
import { GridConfig } from './config/gridConfig';
import { eEventType } from './model/enums/eEventType';
import { SelectGridEvent } from './model/events/selectGridEvent';
import { eSelectType } from './model/enums/eSelectType';
import { eSelectAction } from './model/enums/eSelectAction';
import { PaginatorOutput } from './model/paginatorOutput';
import { GridService } from './service/grid.service';
import { GridTextModel } from './gridTextModel';
import { MatTableDataSource } from '@angular/material/table';
import { LocalStorageService } from 'public-api';

let paginatorIntl1 = new MatPaginatorIntl();

@Component({
  selector: 'GridComponent',
  templateUrl: './gridComponent.html',
  styleUrls: ['./gridComponent.css'],
  providers: [{ provide: MatPaginatorIntl, useValue: paginatorIntl1 }],
})
export class GridComponent implements OnInit, OnChanges {
  @Input() data;
  @Input() config: GridConfig;
 
  @Output() gridEvent = new EventEmitter();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  

  dataSource = new MatTableDataSource();
  eSortOrder = eSortOrder;
  eDateType = eDateType;
  gridText: GridTextModel = gridText;
  Select: SelectedData;
  paginatorData: PaginatorData;
  displayedColumns = new Array();
  public columns: ColumnData[];
  public currentLanguage: string;

  constructor(private gridService: GridService) {}

  ngOnInit(): void {
    this.config.methods.removeAllRows = (params: string) => {
      this.setLabels();
    };
    this.handlePaginator();
  }

  ngOnDestroy(){
    this.gridService.PicklistInitial(this.columns);
        this.uncheckPicklist();
    }

  ngOnChanges() {
    if (this.data) {
      const dbItemCount = this.data[0];
      const dbItemData = this.data[1];

      this.dataSource.data = dbItemData;
      this.dataSource.data.length = dbItemCount;

      this.columns = this.config.columns;
      this.Select = this.config.select;
      this.currentLanguage = this.config.language;
      this.displayedColumns = this.columns?.map((i) => i.id);
      this.setLabels();
      this.handlePaginator();
    }
  }

  private handlePaginator() {
    this.paginatorData = this.config.paginator;
    this.dataSource.paginator = this.paginator;

    if (this.config.showPaginator) {
      this.config.paginator.length = this.data[0];
    } else {
      this.dataSource.data.length = this.getActualDataItemsCount;
      this.dataSource.paginator._changePageSize(this.getActualDataItemsCount);
    }
  }

  get getActualDataItemsCount() {
    return this.data[1]?.filter((d) => d != undefined)?.length;
  }

  setLabels() {
    this.gridText = gridText;
    if (this.config.gridText) {
      for (let element in this.config.gridText) {
        this.gridText[element] = this.config.gridText[element];
      }
    }
    paginatorIntl1.itemsPerPageLabel = this.gridText.PaginatorItemsPerPage;
    paginatorIntl1.nextPageLabel = this.gridText.PaginatorNextPage;
    paginatorIntl1.previousPageLabel = this.gridText.PaginatorPreviousPage;
  }

  sortColumnAction(column: ColumnData, columns: ColumnData[]) {
    if (column.filter.sortOrder == eSortOrder.None) {
      column.filter.sortOrder = eSortOrder.Up;
      let maxIndex = 0;
      columns.forEach((element) => {
        if (element.filter?.orderIndex > maxIndex) {
          maxIndex = element.filter?.orderIndex;
        }
      });
      column.filter.orderIndex = maxIndex + 1;
    } else if (column.filter.sortOrder == eSortOrder.Up) {
      column.filter.sortOrder = eSortOrder.Down;
    } else if (column.filter.sortOrder == eSortOrder.Down) {
      column.filter.sortOrder = eSortOrder.None;
      let actualIndex = column.filter?.orderIndex;
      column.filter.orderIndex = null;
      columns.forEach((element) => {
        if (element.filter && element.filter?.orderIndex > actualIndex) {
          element.filter.orderIndex = element.filter?.orderIndex - 1;
        }
      });
    }
    this.filterEvent();
  }

  fromToFilterFrom(column: ColumnData, value: number) {
    if (value == 0) {
      column.filter.fromTo[0] = null;
    } else {
      column.filter.fromTo[0] = +value;
    }
    this.filterEvent();
  }

  fromToFilterTo(column: ColumnData, value: number) {
    if (value == 0) {
      column.filter.fromTo[1] = null;
    } else {
      column.filter.fromTo[1] = +value;
    }
    this.filterEvent();
  }

  dateFilter(column: ColumnData, value: string, type: string) {
    let date: Date;
    if (value == null) {
      date = null;
    } else {
      date = new Date(value);
    }
    console.log(value);
    if (type == 'from') {
      column.filter.dateValue[2] = null;
      column.filter.dateValue[0] = date;
    } else if (type == 'to') {
      column.filter.dateValue[2] = null;
      column.filter.dateValue[1] = date;
    } else if (type == 'month') {
      column.filter.dateValue[0] = null;
      column.filter.dateValue[1] = null;
      column.filter.dateValue[2] = date;
    }
    this.filterEvent();
  }

  textSearchFilter(column: ColumnData, value: string) {
    column.filter.text = value;
    this.filterEvent();
  }

  picklistFilter(column: ColumnData, value: number) {
    let index: number = column.filter.picklistValues.indexOf(value.toString());
    if (index >= 0) {
      column.filter.picklistValues.splice(index, 1);
    } else {
      column.filter.picklistValues.push(value.toString());
    }
    this.filterEvent();
  }

  filterEvent() {
    let object: FilterGridEvent = {
      eventType: eEventType.Filter,
      gridId: this.config.gridId,
    };
    this.gridEvent.emit(object);
  }

  columnAction(action: string, element, column: ColumnData) {
    var object: ActionGridEvent = {
      eventType: eEventType.Action,
      gridId: this.config.gridId,
      action: action,
      column: column,
      row: element,
    };
    this.gridEvent.emit(object);
  }

  changePageAction(event: PaginatorOutput) {
    this.paginatorData.pageIndex = event.pageIndex;
    this.paginatorData.pageSize = event.pageSize;
    this.paginatorData.length = event.length;
    var object: PaginatorGridEvent = {
      eventType: eEventType.Paginator,
      gridId: this.config.gridId,
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
      previousPageIndex: event.previousPageIndex,
    };
    this.gridEvent.emit(object);
  }

  multiSelectAction(element) {
    let object: SelectGridEvent;
    let index: number = this.Select.multiSelectValues.indexOf(
      element[this.Select.selectedKey].toString()
    );
    let value: string[] = new Array();
    value.push(element[this.Select.selectedKey].toString());
    if (index >= 0) {
      this.Select.multiSelectValues.splice(index, 1);
      object = {
        eventType: eEventType.Select,
        gridId: this.config.gridId,
        type: eSelectType.multiSelect,
        action: eSelectAction.unselect,
        value: value,
      };
    } else {
      this.Select.multiSelectValues.push(
        element[this.Select.selectedKey].toString()
      );
      object = {
        eventType: eEventType.Select,
        gridId: this.config.gridId,
        type: eSelectType.multiSelect,
        action: eSelectAction.select,
        value: value,
      };
    }
    this.gridEvent.emit(object);
  }

  singleSelectAction(element) {
    this.Select.selectedValue = element[this.Select.selectedKey];
    let value: string[] = new Array();
    value.push(element[this.Select.selectedKey]);
    let object: SelectGridEvent = {
      eventType: eEventType.Select,
      gridId: this.config.gridId,
      type: eSelectType.singleSelect,
      action: eSelectAction.select,
      value: value,
    };
    this.gridEvent.emit(object);
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  isSelectedAll() {
    let firstColumn =
      this.paginatorData.pageIndex * this.paginatorData.pageSize;
    let lastColumn: number;
    if (firstColumn + this.paginatorData.pageSize < this.paginatorData.length) {
      lastColumn = firstColumn + this.paginatorData.pageSize;
    } else {
      lastColumn = this.paginatorData.length;
    }
    let count: number = 0;
    for (let i = firstColumn; i < lastColumn; i++) {
      // if(this.Select.multiSelectValues.indexOf(this.data.getBaseCollection()[i][this.Select.selectedKey].toString()) < 0){
      //   count++
      // }
    }
    if (count > 0) {
      return false;
    }
    return true;
  }

  isAnySelected() {
    let firstColumn =
      this.paginatorData.pageIndex * this.paginatorData.pageSize;
    let lastColumn: number;
    if (firstColumn + this.paginatorData.pageSize < this.paginatorData.length) {
      lastColumn = firstColumn + this.paginatorData.pageSize;
    } else {
      lastColumn = this.paginatorData.length;
    }
    let count: number = 0;
    for (let i = firstColumn; i < lastColumn; i++) {
      // if(this.Select.multiSelectValues.indexOf(this.data.getBaseCollection()[i][this.Select.selectedKey].toString()) >= 0){
      //   count++
      // }
    }
    if (count > 0) {
      return true;
    }
    return false;
  }

  selectAll() {
    let firstColumn =
      this.paginatorData.pageIndex * this.paginatorData.pageSize;
    let lastColumn: number;
    let value: string[] = new Array();
    if (firstColumn + this.paginatorData.pageSize < this.paginatorData.length) {
      lastColumn = firstColumn + this.paginatorData.pageSize;
    } else {
      lastColumn = this.paginatorData.length;
    }
    for (let i = firstColumn; i < lastColumn; i++) {
      // if(this.Select.multiSelectValues.indexOf(this.data.getBaseCollection()[i][this.Select.selectedKey].toString()) < 0){
      //   this.Select.multiSelectValues.push(this.data.getBaseCollection()[i][this.Select.selectedKey].toString());
      //   value.push(this.data.getBaseCollection()[i][this.Select.selectedKey].toString());
      // }
    }
    let object: SelectGridEvent = {
      eventType: eEventType.Select,
      gridId: this.config.gridId,
      type: eSelectType.multiSelect,
      action: eSelectAction.select,
      value: value,
    };
    this.gridEvent.emit(object);
  }

  deselectAll() {
    let firstColumn =
      this.paginatorData.pageIndex * this.paginatorData.pageSize;
    let lastColumn: number;
    let value: string[] = new Array();
    if (firstColumn + this.paginatorData.pageSize < this.paginatorData.length) {
      lastColumn = firstColumn + this.paginatorData.pageSize;
    } else {
      lastColumn = this.paginatorData.length;
    }
    for (let i = firstColumn; i < lastColumn; i++) {
      // let index = this.Select.multiSelectValues.indexOf(this.data.getBaseCollection()[i][this.Select.selectedKey].toString());
      // if(index >= 0){
      //   this.Select.multiSelectValues.splice(index, 1)
      //   value.push(this.data.getBaseCollection()[i][this.Select.selectedKey].toString());
      // }
    }
    let object: SelectGridEvent = {
      eventType: eEventType.Select,
      gridId: this.config.gridId,
      type: eSelectType.multiSelect,
      action: eSelectAction.select,
      value: value,
    };
    this.gridEvent.emit(object);
  }

  isArrayNull(array: string[]) {
    let count: number = 0;
    array.forEach((element) => {
      if (element != null) {
        count++;
      }
    });
    if (count > 0) {
      return false;
    }
    return true;
  }

  clearFilters() {
    if(this.config.initialColumns){
      this.gridService.setInitialFilters(this.columns, this.config.initialColumns);
      this.uncheckPicklist();
      this.filterEvent();
    }
     if(!this.config.initialColumns){
      this.gridService.clearFilters(this.columns)
      this.filterEvent();
     }
    }


    uncheckPicklist () {
    
      this.checkboxes.forEach((element) => {
        element.nativeElement.checked = false;
      });
  
  
    }

  exportToExcel() {
    this.gridService.exportToExcel<object>(this.data.baseCollection, 'Emails');
  }
}
