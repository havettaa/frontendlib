import { GridEvent } from "./base/gridEvent";
import { eEventType } from "./enums/eEventType";

export class PaginatorOutput implements GridEvent{
    readonly eventType: eEventType;
    readonly gridId: string;
    pageSize: number;
    previousPageIndex: number;
    pageIndex: number;
    length: number;
}