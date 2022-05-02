import { ColumnData } from '../model/columnsData';
import { SelectedData } from '../model/selectedData';
import { PaginatorData } from '../model/paginatorData';
import { GridTextModel } from '../gridTextModel';
import { FilterData } from '../model/filterData';
import { GridUserSettings } from './gridUserSettings';

export class GridConfig {
	constructor(gridId: string, obj?: object) {
		this.gridId = gridId;
	}

	methods: {
		removeAllRows?: (labels: string) => void;
	} = {};

	gridId: string;
	language: string;

	_initialColumns: ColumnData[]; // first value that is set for columns prop
	get initialColumns(): ColumnData[] {
		return this._initialColumns;
	}
	
	_columns: ColumnData[];
	get columns(): ColumnData[] {
		return this._columns;
	}
	set columns(value: ColumnData[]) {
		this._columns = value;
		// Only set initial column values first time, we store the initial value in separate _initialColumns prop
		if (!this._initialColumns)
	        this._initialColumns = (JSON.parse(JSON.stringify(this.columns)));
	}
   

	paginator: PaginatorData = {
		pageSize: 5,
		pageSizeOptions: [5, 10, 20],
		pageIndex: 0,
	};
	select: SelectedData = null;

	showClearFilters: boolean = true;
	showExportToExcel: boolean = true;
	showPaginator: boolean = true;

	defaultOrderBy: any = null;
	defaultFilter: any = null;
	initialColums: ColumnData[];

	gridText: GridTextModel = null;

	disableMonthDatepicker: boolean = true;

	getGridUserSettings(): GridUserSettings {
		const filterValues: [string, FilterData][] = [];
		this.columns.map((c) => filterValues.push([c.id, c.filter]));

		let state = new GridUserSettings();
		state.filterValues = filterValues;
		state.paginatorData = this.paginator;

		return state;
	}

	updateGridUserSettings(state: GridUserSettings): GridConfig {
		state?.filterValues?.map((s) => {
			let column = this.columns.find((c) => c.id == s[0]);
			if (column) column.filter = s[1];
		});

		this.paginator = state?.paginatorData ?? this.paginator;

		return this;
	}
}
