import { eEventType } from "../enums/eEventType";

export interface GridEvent{
    readonly eventType: eEventType;
    readonly gridId: string;
}