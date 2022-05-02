import { eSortOrder } from './enums/eSortOrder'
import { GridData } from "./base/gridData";

//this can be added to the columnData not remaining as a separate input

export class FilterData implements GridData {
    sortOrder?: eSortOrder;
    orderIndex?: number;
    fromTo?: number[];
    text?: string;
    picklistValues?: string[];    
    dateMin?: string[];
    dateMax?: string[];
    dateValue?: any[];
}