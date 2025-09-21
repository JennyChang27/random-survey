/*
 * 將要隨機派發的網址放入下方（不需排序）
 *
 * 並請注意：
 * 1. 網址請用引號（或稱「撇號」，單引號或雙引號皆可）包起來
 * 2. 包起來的網址之間用逗號分隔
 */


const urls = [
	'https://www.surveycake.com/s/PwOV2',
    'https://www.surveycake.com/s/oN0Q3',
    'https://www.surveycake.com/s/e2m86',
    'https://www.surveycake.com/s/NNY2L',
];

  
  var perGroupLimit = 2;  // 每組上限//
  var totalLimit = urls.length * perGroupLimit;  // 總上限//

  // 指定要操作的 Spreadsheet ID//
  var spreadsheetId = '1pqXw8LG2Wbvf9zYIl0si4FbDQ0KIF91FFzNlDkFgLnI';
  var ss = SpreadsheetApp.openById(spreadsheetId);
  var sheet = ss.getActiveSheet();

  var lastRow = sheet.getLastRow();
  var data = [];

  if (lastRow > 1) {
    data = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
  }

  // 初始化計數//
  var counts = {};
  for (var i = 0; i < urls.length; i++) {
    counts[urls[i]] = 0;
  }

  // 統計目前各組人數//
  for (var r = 0; r < data.length; r++) {
    var v = data[r][0];
    if (v) {
      if (counts.hasOwnProperty(v)) {
        counts[v] += 1;
      } else {
        counts[v] = 1;
      }
    }
  }

  // 計算總已分配人數//
  var totalAssigned = 0;
  for (var key in counts) {
    if (counts.hasOwnProperty(key)) {
      totalAssigned += counts[key];
    }
  }

  // 如果已滿額，回傳已額滿頁面//
  if (totalAssigned >= totalLimit) {
    var fullHtml = '<!doctype html><html><head><meta charset="utf-8"></head><body style="font-family:Arial,Helvetica,sans-serif;text-align:center;padding:40px;"><h2>感謝參與，本研究已額滿！</h2><p>謝謝你的時間。</p></body></html>';
    return HtmlService.createHtmlOutput(fullHtml);
  }

  // 找出還有名額的選項//
  var available = [];
  for (var j = 0; j < urls.length; j++) {
    if (counts[urls[j]] < perGroupLimit) {
      available.push(urls[j]);
    }
  }

  // 隨機分配一個 available//
  var assignedUrl = available[Math.floor(Math.random() * available.length)];

  // 在 Sheet 記錄（Timestamp, AssignedURL）//
  sheet.appendRow([new Date(), assignedUrl]);

  // 安全處理 assignedUrl //
  var safeUrl = assignedUrl.replace(/"/g, '\\"');

  // client-side redirect //
  var redirectHtml = '<!doctype html><html><head><meta charset="utf-8"></head><body><script>window.location.replace("' + safeUrl + '");</script><noscript>Please enable JavaScript or click <a href="' + safeUrl + '">here</a>.</noscript></body></html>';
  return HtmlService.createHtmlOutput(redirectHtml);
}
