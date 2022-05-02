import { GridEvent } from "../base/gridEvent";
import { eEventType } from "../enums/eEventType";
import { eSelectType } from "../enums/eSelectType";
import { eSelectAction } from "../enums/eSelectAction"


export class SelectGridEvent implements GridEvent{
    readonly eventType: eEventType = eEventType.Select;
    readonly gridId: string;
    type: eSelectType;
    action: eSelectAction;
    value: string[];
}