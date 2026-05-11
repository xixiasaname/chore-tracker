// Chore Coins — Google Apps Script backend
// Paste this into: script.google.com → New Project → replace Code.gs → Deploy as Web App

const SHEET              = "chore_entries";
const CONFIG_SHEET       = "config";
const GOALS_SHEET        = "goals";
const TRANSACTIONS_SHEET = "transactions";

const COLS      = ["id","user_id","kid_id","task_key","task_name","amount_eur","game_minutes","status","created_at","approved_at"];
const GOAL_COLS = ["kid_id","goal_name","goal_amount","saved_amount","status","created_at"];
const TXN_COLS  = ["kid_id","type","amount","created_at"];

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET);
    sheet.appendRow(COLS);
    sheet.setFrozenRows(1);
  } else {
    sheet.getRange(1, 1, 1, COLS.length).setValues([COLS]);
  }
  return sheet;
}

function getConfigSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG_SHEET);
  if (!sheet) sheet = ss.insertSheet(CONFIG_SHEET);
  return sheet;
}

function getGoalsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(GOALS_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(GOALS_SHEET);
    sheet.appendRow(GOAL_COLS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getTransactionsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(TRANSACTIONS_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(TRANSACTIONS_SHEET);
    sheet.appendRow(TXN_COLS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function rowToEntry(row) {
  const entry = {};
  COLS.forEach((k, i) => { entry[k] = row[i] === "" ? null : row[i]; });
  return entry;
}

function rowToGoal(row) {
  const g = {};
  GOAL_COLS.forEach((k, i) => { g[k] = row[i] === "" ? null : row[i]; });
  return g;
}

function rowToTxn(row) {
  const t = {};
  TXN_COLS.forEach((k, i) => { t[k] = row[i] === "" ? null : row[i]; });
  return t;
}

function respond(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
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
    const sheet = getSheet();
    const rows  = sheet.getDataRange().getValues().slice(1);
    let entries = rows.map(rowToEntry);
    if (e.parameter.user_id) {
      entries = entries.filter(r => r.user_id === e.parameter.user_id);
    }
    return respond(entries);
  }

  if (action === "add") {
    const sheet = getSheet();
    const entry = JSON.parse(e.parameter.data);
    sheet.appendRow(COLS.map(k => entry[k] ?? ""));
    return respond({ ok: true });
  }

  if (action === "approve") {
    const sheet  = getSheet();
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
    const sheet  = getSheet();
    const id     = e.parameter.id;
    const values = sheet.getDataRange().getValues();
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === id) { sheet.deleteRow(i + 1); break; }
    }
    return respond({ ok: true });
  }

  // ── Goals & Savings ──────────────────────────────────────────────────────────

  if (action === "getGoalData") {
    const kidId = e.parameter.kid_id;
    const gs    = getGoalsSheet();
    const ts    = getTransactionsSheet();
    const gRows = gs.getLastRow() > 1
      ? gs.getRange(2, 1, gs.getLastRow() - 1, GOAL_COLS.length).getValues() : [];
    const tRows = ts.getLastRow() > 1
      ? ts.getRange(2, 1, ts.getLastRow() - 1, TXN_COLS.length).getValues() : [];
    // most-recent active goal wins
    const goal = gRows.map(rowToGoal).reverse().find(g => g.kid_id === kidId && g.status === "active") || null;
    const txns = tRows.map(rowToTxn).filter(t => t.kid_id === kidId);
    return respond({ goal, transactions: txns });
  }

  if (action === "setGoal") {
    const kidId      = e.parameter.kid_id;
    const goalName   = e.parameter.goal_name;
    const goalAmount = parseFloat(e.parameter.goal_amount) || 0;
    const gs         = getGoalsSheet();
    const rows       = gs.getLastRow() > 1
      ? gs.getRange(2, 1, gs.getLastRow() - 1, GOAL_COLS.length).getValues() : [];
    let carryover = 0;
    for (let i = 0; i < rows.length; i++) {
      const g = rowToGoal(rows[i]);
      if (g.kid_id === kidId && g.status === "active") {
        carryover = parseFloat(g.saved_amount) || 0;
        gs.getRange(i + 2, GOAL_COLS.indexOf("status") + 1).setValue("replaced");
        break;
      }
    }
    const surplus     = Math.max(0, carryover - goalAmount);
    const newSavedAmt = Math.min(carryover, goalAmount);
    gs.appendRow([kidId, goalName, goalAmount, newSavedAmt, "active", new Date().toISOString()]);
    if (surplus > 0) {
      getTransactionsSheet().appendRow([kidId, "surplus_return", surplus, new Date().toISOString()]);
    }
    return respond({ ok: true, carryover, surplus });
  }

  if (action === "cashoutGoal") {
    const kidId = e.parameter.kid_id;
    const gs    = getGoalsSheet();
    const rows  = gs.getLastRow() > 1
      ? gs.getRange(2, 1, gs.getLastRow() - 1, GOAL_COLS.length).getValues() : [];
    for (let i = 0; i < rows.length; i++) {
      const g = rowToGoal(rows[i]);
      if (g.kid_id === kidId && g.status === "active") {
        gs.getRange(i + 2, GOAL_COLS.indexOf("status") + 1).setValue("paid_out");
        getTransactionsSheet().appendRow([kidId, "cashout_goal", parseFloat(g.saved_amount) || 0, new Date().toISOString()]);
        return respond({ ok: true });
      }
    }
    return respond({ error: "No active goal" });
  }

  if (action === "saveAmount") {
    const kidId  = e.parameter.kid_id;
    const amount = parseFloat(e.parameter.amount) || 0;
    const ts     = getTransactionsSheet();
    ts.appendRow([kidId, "save", amount, new Date().toISOString()]);
    const gs   = getGoalsSheet();
    const rows = gs.getLastRow() > 1
      ? gs.getRange(2, 1, gs.getLastRow() - 1, GOAL_COLS.length).getValues() : [];
    for (let i = 0; i < rows.length; i++) {
      const g = rowToGoal(rows[i]);
      if (g.kid_id === kidId && g.status === "active") {
        const newSaved = (parseFloat(g.saved_amount) || 0) + amount;
        gs.getRange(i + 2, GOAL_COLS.indexOf("saved_amount") + 1).setValue(newSaved);
        break;
      }
    }
    return respond({ ok: true });
  }

  if (action === "cashout") {
    const kidId  = e.parameter.kid_id;
    const type   = e.parameter.type; // "cashout_money" | "cashout_time"
    const amount = parseFloat(e.parameter.amount) || 0;
    const ts     = getTransactionsSheet();
    ts.appendRow([kidId, type, amount, new Date().toISOString()]);
    return respond({ ok: true });
  }

  return respond({ error: "Unknown action" });
}
