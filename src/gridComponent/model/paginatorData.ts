import { ePageSizeOptions } from "./enums/ePageSizeOptions";
import { GridData } from "./base/gridData";

export class PaginatorData implements GridData{
    pageSize: number;
    pageSizeOptions: ePageSizeOptions[];
    pageIndex: number;
    length?: number;
}