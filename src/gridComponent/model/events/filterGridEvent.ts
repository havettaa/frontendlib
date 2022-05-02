import { GridEvent } from "../base/gridEvent";
import { eEventType } from "../enums/eEventType";

export class FilterGridEvent implements GridEvent{
    readonly eventType: eEventType = eEventType.Action;

    readonly gridId: string;
}