const moment = require('moment');
// Moment complains about RFC2822/ISO date not being correct
moment.suppressDeprecationWarnings = true;

const numeral = require('numeral');
const marked = require('marked');

module.exports = function (env) {
  /**
  * Instantiate object used to store the methods registered as a
  * 'filter' (of the same name) within nunjucks. You can override
  * gov.uk core filters by creating filter methods of the same name.
  * @type {Object}
  */
  let filters = {}

  /* ------------------------------------------------------------------
    date filter for use in Nunjucks
    example: {{ params.date | date("DD/MM/YYYY") }}
    outputs: 01/01/1970
  ------------------------------------------------------------------ */
  filters.date = function(timestamp, format) {
    return moment(timestamp).format(format);
  }

  /* ------------------------------------------------------------------
    dateAdd filter for use in Nunjucks
    example: {{ '1970-01-01' | dateAdd(1, 'weeks') | date("DD/MM/YYYY") }}
    outputs: 08/01/1970
  ------------------------------------------------------------------ */
  filters.dateAdd = function(date, num, unit='days') {
    return moment(date).add(num, unit).toDate();
  }

  /* ------------------------------------------------------------------
    utility date functions
  ------------------------------------------------------------------ */
  filters.govDate = function(timestamp) {
    return moment(timestamp).format('D MMMM YYYY');
  }

  filters.govShortDate = function(timestamp) {
    return moment(timestamp).format('D MMM YYYY');
  }

  filters.govTime = function(timestamp) {
    let t = moment(timestamp);
    if(t.minutes() > 0) {
      return t.format('h:mma');
    } else {
      return t.format('ha');
    }
  }

  /* ------------------------------------------------------------------
    numeral filter for use in Nunjucks
    example: {{ params.number | numeral("0,00.0") }}
    outputs: 1,000.00
  ------------------------------------------------------------------ */
  filters.numeral = function(number, format) {
    return numeral(number).format(format);
  }

  /* ------------------------------------------------------------------
    utility function to return a list from array
    example: {{ ["England","Scotland","Wales"] | arrayToList }}
    outputs: England, Scotland and Wales
  ------------------------------------------------------------------ */
  filters.arrayToList = function(array, join = ', ', final = ' and ') {
    var arr = array.slice(0);

    var last = arr.pop();

    if (array.length > 1) {
      return arr.join(join) + final + last;
    }

    return last;
  }

  /* ------------------------------------------------------------------
    utility function to get an error for a component
    example: {{ errors | getErrorMessage('title') }}
    outputs: "Enter a title"
  ------------------------------------------------------------------ */
  filters.getErrorMessage = function(array, fieldName) {
    if (!array || !fieldName)
      return null;

    let error = array.filter( (obj) =>
      obj.fieldName == fieldName
    )[0];

    return error;
  }
  
  /* ------------------------------------------------------------------
    utility function to create HTML from markdown
    example: {{ "**Enter a title**" | markdownToHtml }}
    outputs: "Enter a title"
  ------------------------------------------------------------------ */
  filters.markdownToHtml = function(markdown) {
    if (!markdown)
      return null;

    return html = marked(markdown);
  }
  
  /*
  =====================================================================
  arrayToGovukTable

  Convert an array to form needed for govukTable macro
  =====================================================================

  Expects array or nested array.

  Usage:

  {% set tableData = [
    ["1 January", "Friday", "New Year’s Day"],
    ["2 April", "Friday", "Good Friday"],
    ["5 April", "Monday", "Easter Monday"]
    ]
  %}

  {{ govukTable({
    caption: "2021 Bank holidays",
    firstCellIsHeader: true,
    head: [
      {
        text: "Date"
      },
      {
        text: "Day of week"
      },
      {
        text: "Holiday name"
      }
    ],
    rows: tableData | arrayToGovukTable
  }) }}

  */

  filters.arrayToGovukTable = (array) => {
    // Coerce to nested array
    array = (Array.isArray(array[0])) ? array : [array]
    let tableData = []
    array.forEach(row => {
      let rowData = []
      row.forEach(item => {
        rowData.push({
          html: item  // html for flexibility
        })
      })
      tableData.push(rowData)
    })
    // tableData = (tableData.length == 1) ? tableData[0] : tableData
    return tableData;
  }

  /*
  =====================================================================
  csvToArray

  Convert a CSV string to array or nested array
  =====================================================================

  Expects CSV string. Requires 'csv-string' npm module

  Usage:

  let csvData =
    "Product images,✔,✔,✔,✗
    Case images,✔,✔,✔,✗
    Attachments uploaded with a document,✔,✔,✔,✗
    Generic attachments,✔,✔,✗,✗"

  {% set arrayData = csvData | csvToArray %}

  */

  // var CSV = require('csv-string')
  // 
  // filters.csvToArray = (csvString) => {
  //   array = CSV.parse(csvString);
  //   // Flatten nested array if it's only a single line
  //   array = (array.length == 1) ? array[0] : array
  //   return array;
  // }

  /*
  =====================================================================
  csvToGovukTable

  Convert a CSV string to form needed for govukTable macro
  =====================================================================

  Expects a CSV string. Requires csvToArray filter (above)

  Usage:

  {% set tableData =
    "1 Janury, Friday, New Year’s Day
    2 April, Friday, Good Friday
    5 April, Monday, Easter Monday"
  %}


  {{ govukTable({
    caption: "2021 Bank holidays",
    firstCellIsHeader: true,
    head: [
      {
        text: "Date"
      },
      {
        text: "Day of week"
      },
      {
        text: "Holiday name"
      }
    ],
    rows: tableData | csvToGovukTable
  }) }}

  */

  filters.csvToGovukTable = (csvString) => {
    let array = filters.csvToArray(csvString)
    return filters.arrayToGovukTable(array);
  }

  /*
  =====================================================================
  arrayToSumaryList

  Convert a nested array to form needed for govukSummaryList
  =====================================================================

  Expects nested array. Key and value are required, the others optional

  Usage:

  let summaryListData = [
    [ "Full name", "Ed Horsford", "/change-name"],
    [ "Email address", "test@example.com", "/change-email"],
    [ "Password", "Set 22 days ago", "/reset", "Reset", "your password"],
  ]

  {{ govukSummaryList({
    rows: summaryListData | arrayToSummaryList
  }) }}

  */

  filters.arrayToSummaryList = array => {
    let arrData = []
    array.forEach( row => {
      let key = row[0]  // required
      let value = row[1] // required
      let href = (row[2] != null) ? row[2] : false
      let text = (row[3] != null ) ? row[3] : "Change"
      let visuallyHiddenText = (row[4] != null ) ? row[4] : row[0].toLowerCase()
      let rowData = {
        key: {
          text: key
        },
        value: {
          html: value // html for flexibility
        }
      }
      // Action (optional)
      if (href){
        let item = {
          href,
          text,
          visuallyHiddenText
        }
        rowData.actions = {
          items: [item]
        }
      }
      arrData.push(rowData)
    })
    return arrData;
  }

  /* ------------------------------------------------------------------
    keep the following line to return your filters to the app
  ------------------------------------------------------------------ */
  return filters
}
