import { getYear, getMonth } from "date-fns";
import { uniq, cloneDeep, sortBy } from "lodash";
/** @namespace utils */

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
 * @export
 * @param {number} number number to round
 * @param {number} precision precision of rounding, can be postive or negative
 * @returns {number} the rounded number
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
