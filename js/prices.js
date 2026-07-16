/* =========================================================================
   BARAKAH TRAVELS - PRICE LIST
   -------------------------------------------------------------------------
   ▶ PRICES NOW COME FROM YOUR GOOGLE SHEET.
     Edit the sheet and the website updates automatically - nothing to do here.
   ▶ "sheetCsvUrl" is the published-to-web CSV link of your Google Sheet.
   ▶ The numbers below are FALLBACK prices, shown only if the Google Sheet
     ever fails to load. Keep them roughly up to date.
   ========================================================================= */

const PRICE_LIST = {

  // Published Google Sheet (CSV) - paste your link between the quotes:
  sheetCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTVo2qYZryTkBk4tj5D6gu57ZKqoOSF5TBoMQSQS9sQ8hoMtt4L3L2L3-KB9yqWFLKOSpeHgupYRUfx/pub?gid=0&single=true&output=csv",

  // Fallback values (used only if the sheet can't be reached)
  lastUpdated: "23 June 2026",

  packages: {
    "7":  { price: 250000 },     // 7 Days Umrah
    "15": { price: 340000 },     // 15 Days Umrah
    "21": { price: 360000 }      // 21 Days Umrah
  }

};
