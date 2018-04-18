import { getYear, getMonth } from "date-fns";
import { uniq, cloneDeep, sortBy } from "lodash";

/**
 * returns startYear and endYear of stationvisits []
 *
 * @export totalYearRange
 * @param {StationVisit[]} data array of stationvisits
 * @returns {{startYear : number, endYear: number}}  - startYear & endYear
 */
export function totalYearRange(data) {
  return {
    startYear: getYear(data[0].date),
    endYear: getYear(data[data.length - 1].date)
  };
}

/**
 * returns array of paramater keys
 *
 * @export getParams
 * @param {StationVisit[]} data list of station visits
 * @returns {String[]} list of parameter keys, i.e. 'H2O_Temp'
 */
export function getParams(data) {
  let params = [];
  data.map(d => {
    return (params = params.concat(Object.keys(d.results)));
  });
  return uniq(params);
}

export function getDataPointsPerParam(data) {
  return null;
}

/**
 * rounds number to precision, '-1' rounds 1234 to 1230, '2' rounds 1234.1234 to 1234.12
 *
 * @export precisionRound
 * @param {number} number number to round
 * @param {number} precision precision of rounding, can be postive or negative
 * @returns {number} the rounded number
 * @example precisionRound(2014.2,-1) = 2010
 */
export function precisionRound(number, precision) {
  if (!number) return null;
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

/**
 * fills in months that don't have any data with null so that charts show gaps
 *
 * @export nullBuffer
 * @param {Array} data
 * @returns {Array} array of StationVisits
 */
export function nullBuffer(data) {
  let startYear = getYear(data[0][0]);
  let endYear = getYear(data[data.length - 1][0]);
  for (let year = startYear; year <= endYear; year++) {
    for (let month = 0; month <= 11; month++) {
      let valueExists = data.some((e, index) => {
        let m = getMonth(e[0]);
        let y = getYear(e[0]);
        if (m === month && y === year) {
          return true;
        }
      });
      if (!valueExists) {
        let monthStr = (month + 1).toString();
        if (month < 9) {
          monthStr = "0" + monthStr;
        }
        data.push([year.toString() + "-" + monthStr + "-01", null]);
      }
    }
  }
  return sortBy(data, o => o[0]);
}

/**
 * splits data up in Array of 12 by month
 *
 * @export splitByMonth
 * @param {Array} data  array of ['YYYY-MM-DD',number]
 * @param {boolean} [removeNulls=false] if true removes all null values, **defaults to false**
 * @returns {Array[]} array of 12 split by month
 */
export function splitByMonth(data, removeNulls = false) {
  let arr = new Array(12).fill([]);
  data.map(d => {
    if ((removeNulls && d[1]) || !removeNulls) {
      let month = getMonth(d[0]);
      arr[month] = arr[month].concat([d]);
    }
  });
  return arr;
}
