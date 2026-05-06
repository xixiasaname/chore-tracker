// Chore Coins — Google Apps Script backend
// Paste this into: script.google.com → New Project → replace Code.gs → Deploy as Web App

const SHEET        = "chore_entries";
const CONFIG_SHEET = "config";
const COLS  = ["id","user_id","kid_id","task_key","task_name","amount_eur","sessions","status","created_at","approved_at"];

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET);
    sheet.appendRow(COLS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function rowToEntry(row) {
  const entry = {};
  COLS.forEach((k, i) => { entry[k] = row[i] === "" ? null : row[i]; });
  return entry;
}

function respond(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getConfigSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG_SHEET);
  if (!sheet) sheet = ss.insertSheet(CONFIG_SHEET);
  return sheet;
}

function doGet(e) {
  const sheet  = getSheet();
  const rows   = sheet.getDataRange().getValues().slice(1); // skip header
  const action = e.parameter.action;

  if (action === "getConfig") {
    const cs  = getConfigSheet();
    const val = cs.getLastRow() > 0 ? cs.getRange(1, 1).getValue() : "";
    return respond(val ? JSON.parse(val) : null);
  }

  if (action === "saveConfig") {
    getConfigSheet().getRange(1, 1).setValue(e.parameter.config);
    return respond({ ok: true });
  }

  if (action === "get") {
    let entries = rows.map(rowToEntry);
    if (e.parameter.user_id) {
      entries = entries.filter(r => r.user_id === e.parameter.user_id);
    }
    return respond(entries);
  }

  if (action === "add") {
    const entry = JSON.parse(e.parameter.data);
    sheet.appendRow(COLS.map(k => entry[k] ?? ""));
    return respond({ ok: true });
  }

  if (action === "approve") {
    const id     = e.parameter.id;
    const values = sheet.getDataRange().getValues();
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === id) {
        sheet.getRange(i + 1, COLS.indexOf("status") + 1).setValue("approved");
        sheet.getRange(i + 1, COLS.indexOf("approved_at") + 1).setValue(new Date().toISOString());
        break;
      }
    }
    return respond({ ok: true });
  }

  if (action === "delete") {
    const id     = e.parameter.id;
    const values = sheet.getDataRange().getValues();
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === id) { sheet.deleteRow(i + 1); break; }
    }
    return respond({ ok: true });
  }

  return respond({ error: "Unknown action" });
}
