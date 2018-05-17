class TableFactory {
  constructor(sheet_name) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheet_name);
    const gridRange = sheet.getDataRange();
    return new Sheetfu.Table(gridRange);
  }
}

export default TableFactory;
