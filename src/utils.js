import { getYear } from "date-fns";
import { uniq } from "lodash";
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

/**
 * only returns data between **startYear** and **endYear**
 *
 * @export getDataForYearRange
 * @param {StationVisit[]} data
 * @param {YearRange} yearRange  {startYear: number, endYear: number}
 * @returns {StationVisit[]} between **startYear** & **endYear**
 */
export function getDataForYearRange(data, yearRange) {
  let { startYear, endYear } = yearRange;
  let filteredData = data.filter(d => {
    if (getYear(d.date) >= startYear && getYear(d.date) <= endYear) {
      return true;
    }
  });
  return filteredData;
}

export function getDataPointsPerParam(data) {
  return null;
}
