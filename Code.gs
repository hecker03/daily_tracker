// Google Sheet: Extensions > Apps Script > paste > Deploy > Web app
// Execute as: Me | Who has access: Anyone > copy the /exec URL into extension config "webhook"
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sh.getLastRow() === 0) sh.getRange(1, 1).setValue('Date');
  const col = name => {
    const h = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    let i = h.indexOf(name);
    if (i < 0) { i = h.length; sh.getRange(1, i + 1).setValue(name); }
    return i + 1;
  };
  const last = sh.getLastRow();
  const dates = last > 1 ? sh.getRange(2, 1, last - 1, 1).getDisplayValues().flat() : [];
  let row = dates.indexOf(d.date);
  row = row < 0 ? last + 1 : row + 2;
  sh.getRange(row, 1).setNumberFormat('@').setValue(d.date);
  for (const [k, v] of Object.entries(d.minutes)) sh.getRange(row, col(k)).setValue(v);
  return ContentService.createTextOutput('ok');
}
