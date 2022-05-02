// @ts-ignore
import * as FileSaver from 'file-saver';
// @ts-ignore
import * as XLSX from 'xlsx';



export function exportToExcel(data: any[], FileSaver: any, XLSX: any) {
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const excelData: Blob = new Blob([excelBuffer], {});
  FileSaver.saveAs(excelData,  `export${new Date().getMilliseconds()}.xlsx`);
}
