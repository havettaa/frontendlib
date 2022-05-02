import { GridEvent } from '../base/gridEvent';
import { eEventType } from '../enums/eEventType';
import { ePageSizeOptions } from '../enums/ePageSizeOptions';

export class PaginatorGridEvent implements GridEvent {
  readonly eventType: eEventType = eEventType.Paginator;

  readonly gridId: string;

  public pageIndex: number;

  public previousPageIndex: number;

  public pageSize: ePageSizeOptions;
}
