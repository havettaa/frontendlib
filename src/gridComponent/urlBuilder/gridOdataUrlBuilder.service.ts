import { Injectable } from '@angular/core';

import { OrderByParams } from "../../urlBuilder/params/orderByParameters"
import { eOdataOrderBy } from "../../urlBuilder/enumerators/eOdataOrderBy";
import { QueryParameters } from "../../urlBuilder/params/queryParameters"
import { eOdataOperator } from '../../urlBuilder/enumerators/eOdataOperator';
import { PagingParameters } from '../../urlBuilder/params/pagingParameters';
import { IOdataParameter } from '../../urlBuilder/params/IOdataParameter';

import { GridConfig } from '../config/gridConfig';
import { ColumnData } from "../model/columnsData";
import { ePicklistKeyType } from '../model/enums/ePicklistKeyType';
import { eSortOrder } from '../model/enums/eSortOrder';

@Injectable()
export class GridOdataUrlBuilderService
{
  constructor() { }

  private getOdataFilterUrl(columns: ColumnData[]): QueryParameters
  {
    let url = new QueryParameters();
    columns.forEach(element => {
      if(element.filter != undefined){
        if(element.filter.fromTo != undefined && element.filter.fromTo != [null, null]){
          this.getFromToFilter(element.id, element.filter.fromTo, url);
        }
        if(element.filter.text != undefined && element.filter.text != ""){
          this.getTextSearchFilter(element.id, element.filter.text, url);
        }
        if(element.filter.picklistValues != undefined && element.filter.picklistValues.length > 0){
          this.getPicklistFilter(element.id, element.filter.picklistValues, element.picklistKeyType, url)
        }
        if(element.filter.dateValue != undefined && element.filter.picklistValues != [null, null, null]){
          this.dateFilter(element.id, element.filter.dateValue, url);
        }
      }
    });
    return url;
  }

  private getOdataOrderUrl(columns: ColumnData[]): OrderByParams
  {
    let url = new OrderByParams();
    for(let i = 1; i < columns.length+1; i++){
      columns.forEach(element => {
        if(element.filter?.orderIndex == i){
          if(element.filter.sortOrder == eSortOrder.Up){
            url.push(element.id, eOdataOrderBy.Ascending)
          }
          if(element.filter.sortOrder == eSortOrder.Down){
            url.push(element.id, eOdataOrderBy.Descending)
          }
        }
      });
    }
    return url;
  }

  private getFromToFilter(columnName: string, fromToValues: number[], url: QueryParameters): void
  {
    let fromValue: number = fromToValues[0];
    let toValue: number = fromToValues[1];
    if(fromValue != null){
      url.pushNumber(columnName, fromValue, eOdataOperator.GreaterOrEqual)
    }
    if(toValue != null){
      url.pushNumber(columnName, toValue, eOdataOperator.LessOrEqual)
    }
  }

  private getTextSearchFilter(columnName: string, textSearchValue: string, url: QueryParameters): void
  {
    if(textSearchValue != ""){
      url.pushTextSearch(columnName, textSearchValue);
    }
  }

  private getPicklistFilter(columnName: string, picklistValues: string[], picklistKeyType: ePicklistKeyType, url: QueryParameters): void
  {
    if(picklistKeyType == ePicklistKeyType.Text){
      url.pushPicklistText(columnName, picklistValues);
    }
    if(picklistKeyType == ePicklistKeyType.Number){
      url.pushPicklistNumber(columnName, picklistValues);
    }
  }

  private dateFilter(columnName: string, dateValues: string[], url: QueryParameters): void
  {
    let fromValue: string = dateValues[0];
    let toValue: string = dateValues[1];
    let monthValue: string = dateValues[2];
    if(fromValue != null){
      let date = new Date(fromValue);
      url.pushDate(columnName, date.toISOString(), eOdataOperator.GreaterOrEqual);
    }
    if(toValue != null){
      let date = new Date(toValue);
      url.pushDate(columnName, date.toISOString(), eOdataOperator.LessThen);
    }
    if(monthValue != null){
      let date = new Date(monthValue);
      date.setHours(date.getHours());
      let month = +date.toISOString().substring(6, 7);
      let year = +date.toISOString().substring(0, 4);
      url.pushNumber(`month(${columnName})`, month, eOdataOperator.Equals)
      url.pushNumber(`year(${columnName})`, year, eOdataOperator.Equals)
    }
  }

  buildParamsFromConfig(config: GridConfig): IOdataParameter[]
  {
    let odataParameters = new Array<IOdataParameter>();
    let orderBy: OrderByParams = this.getOdataOrderUrl(config.columns);
    let filter: QueryParameters = this.getOdataFilterUrl(config.columns);
    let paging = new PagingParameters(config.paginator.pageIndex, config.paginator.pageSize, true);

    orderBy.merge(config.defaultOrderBy);
    filter.merge(config.defaultFilter);

    odataParameters.push(orderBy);
    odataParameters.push(filter);
    odataParameters.push(paging);

    return odataParameters;
  }
}
