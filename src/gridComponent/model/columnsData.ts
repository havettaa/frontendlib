import { eWidthClass } from "./enums/eWidthClass";
import { PicklistItem } from "./picklistItem";
import { FilterData } from "./filterData";
import { GridData } from "./base/gridData";
import { ePicklistKeyType } from "./enums/ePicklistKeyType";

export class ColumnData implements GridData{
    id: string;
    name: string = "";
    widthClass?: eWidthClass = eWidthClass.width01;
    isSingleSelect?: boolean = false;
    isMultiSelect?: boolean = false;
    disableOrder?: boolean = false;
    disableFilter?: boolean = false;
    fromToFilter?: boolean = false;
    textSearchFilter?: boolean = false;
    dateFilter?: boolean = false;
    dateFormat?: string = null;
    checkbox?: boolean = false;
    function?: string = null;
    icon?: string = null;
    filter?: FilterData = null;
    picklistOptions?: PicklistItem[] = null;
    picklistType?: any;
    picklistKeyType?: ePicklistKeyType;
}