import { GridEvent } from "../base/gridEvent";
import { eEventType } from "../enums/eEventType";
import { ColumnData } from "../columnsData";

export class ActionGridEvent implements GridEvent{
    readonly eventType: eEventType = eEventType.Action;

    readonly gridId: string;

    public action: string;

    public column: ColumnData;

    public row: any;
}