import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export class ExcelHelper {
  /** Excel file type default config */
  static EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

  /** Excel file type default extension */
  static EXCEL_EXTENSION = '.xlsx';

  /**
   * Exports an array of objects to an excel file
   * @param json  Data to be exported
   * @param excelFileName  Name of the excel file
   * @param bookType Type of the excel file
   * @param option  Format of the excel file
   * @param extension Excel file extension to save on
   */
  static exportAsExcelFile(json: any[], excelFileName: string, bookType: XLSX.BookType = 'xlsx', option = this.EXCEL_TYPE, extension = this.EXCEL_EXTENSION): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: bookType, type: 'array' });

    this.saveAsExcelFile(excelBuffer, excelFileName, option, extension);
  }

  /**
   * Saves an array of objects to an excel file
   * @param buffer Data to be exported
   * @param fileName Name of the excel file
   * @param type Type of the excel file
   * @param extension Excel file extension to save on
   */
  private static saveAsExcelFile(buffer: any, fileName: string, type = this.EXCEL_TYPE, extension = this.EXCEL_EXTENSION): void {
    const data: Blob = new Blob([buffer], { type: type });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + extension);
  }
}
