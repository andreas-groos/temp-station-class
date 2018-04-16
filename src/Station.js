import * as utils from "./utils";
import { getYear, getMonth } from "date-fns";
import { quantile } from "simple-statistics";
import json2csv from "json2csv";
/**
 * Base class for single Stations, get's instatiated when monitoring data is downloaded.
 * @class Station
 */
export default class Station {
  /**
   * Creates an instance of Station.
   * @exports Station
   * @param {StationInfo} info basic info like StationName, StationID
   * @param {StationVisit[]} data Array of measurments of station visits
   * @memberof Station
   */
  constructor(info, data) {
    this.info = info;
    this.data = this.initData(data);
    this.meta = this.initMeta();
    this.processed = {
      // raw: [...this.data]
    };
  }
  /**
   * Validates and simplifies server response from **sitevisits** query
   *
   * @param {StationVisit[]} data server response from **sitevisits** query
   * @returns {StationVisit[]} takes .mean out and sets H2O_Temp etc directly to 'mean'
   * @memberof Station
   */
  initData(data) {
    // NOTE: Do rounding etc?
    let { results } = data;
    return data.map(d => {
      const r = d.results;
      return {
        id: d.id,
        date: d.date,
        notes: d.notes,
        results: {
          H2O_Temp: r.H2O_Temp && r.H2O_Temp.mean ? r.H2O_Temp.mean : null,
          H2O_Cond: r.H2O_Cond && r.H2O_Cond.mean ? r.H2O_Cond.mean : null,
          H2O_pH: r.H2O_pH && r.H2O_pH.mean ? r.H2O_pH.mean : null,
          H2O_DO: r.H2O_DO && r.H2O_DO ? r.H2O_DO.mean : null,
          H2O_Turbidity:
            r.H2O_Turbidty && r.H2O_Turbidity ? H2O_Turbidity : null,
          Air_Temp: r.Air_Temp && r.Air_Temp.mean ? r.Air_Temp.mean : null
        }
      };
    });
  }
  /**
   * sets meta data like totalYearRange, params etc
   *
   * @returns {Object} meta data {totalYearRange, params}
   * @memberof Station
   */
  initMeta() {
    let totalYearRange = utils.totalYearRange(this.data);
    let params = utils.getParams(this.data);

    return {
      totalYearRange,
      params
    };
  }
  /**
   * only returns data between **startYear** and **endYear** |
   * uses the whole dataset from the server, should be first method used on Station |
   * **adds data property to this.processed** |
   * ** data property is in SiteVisit format** |
   * @param {YearRange} yearRange  {startYear: number, endYear: number}
   * @returns {Object} this - for chaining
   */
  setYearRange(yearRange) {
    let { startYear, endYear } = yearRange;
    let processed = this.data.filter(d => {
      if (getYear(d.date) >= startYear && getYear(d.date) <= endYear) {
        return true;
      }
    });
    this.processed = {
      ...this.processed,
      startYear,
      endYear,
      data: processed
    };
    return this; // Necessary for chaining
  }
  /**
   * fills this.process.data with csv result.
   * By default doesn't include notes but with (true) can be included
   *
   * @param {boolean} [notes=false]
   * @returns this
   * @memberof Station
   */
  getCSV(notes = false) {
    let data = [];
    this.processed.data.map(d => {
      let temp = { date: d.date, ...d.results };
      if (notes) {
        temp.notes = d.notes ? d.notes : "";
      }
      data.push(temp);
    });
    let fields = [...this.meta.params];
    if (notes) {
      fields.push("notes");
    }
    this.processed.data = json2csv.parse(data, fields);
    return this;
  }
  /**
   * Only returns data from the **param** paramater |
   * ** data property is now in [dateStr, mean value] format** |
   *
   * @param {string} param - i.e H2O_Temp, H2O_Cond
   * @memberof Station
   */
  setParam(param) {
    let byParam = this.processed.data.map(d => {
      return [d.date, d.results[param]];
    });
    this.processed = {
      ...this.processed,
      param,
      data: byParam
    };
    return this;
  }
  /**
   * rounds all numbers to 'precision', returns null for null
   *
   * @param {number} precision - precision of return, i.e 1 => 12.1
   * @returns {Object} this
   * @memberof Station
   */
  roundTo(precision) {
    this.processed.data = this.processed.data.map(d => {
      return [d[0], utils.precisionRound(d[1], precision)];
    });
    return this;
  }
  /**
   * adds in null data for months that don't have any data so that the graph shows a gap!
   * adds them in this.processed.data
   *
   * @returns {Object} this
   * @memberof Station
   */
  bufferData() {
    this.processed.data = utils.nullBuffer(this.processed.data);
    return this;
  }
  /**
   * creates Array of [min,q25,q5,q75,max] for boxplots by station
   *
   * @returns  {Array} [min,q25,q5,q75,max]
   * @memberof Station
   */
  boxPlot() {
    let valuesOnly = [];
    this.processed.data.map(d => {
      if (d[1]) {
        valuesOnly.push(d[1]);
      }
    });
    this.processed.data = [
      Math.min(...valuesOnly),
      quantile(valuesOnly, 0.25),
      quantile(valuesOnly, 0.5),
      quantile(valuesOnly, 0.75),
      Math.max(...valuesOnly)
    ];
    return this;
  }
  /**
   * creates Array of 12 Arrays of [min,q25,q5,q75,max] for a boxplot by month for a single station
   *
   * @returns  {Array[]} [[min,q25,q5,q75,max],[...],[...]]
   * @memberof Station
   */
  boxPlotPerMonth() {
    let byMonth = utils.splitByMonth(this.processed.data, true);
    this.processed.data = byMonth.map(d => {
      let valuesOnly = d.map(v => v[1]);
      return [
        Math.min(...valuesOnly),
        quantile(valuesOnly, 0.25),
        quantile(valuesOnly, 0.5),
        quantile(valuesOnly, 0.75),
        Math.max(...valuesOnly)
      ];
    });
    return this;
  }

  /**
   * preps data for linePlot, turns 'YYYY-MM-DD' into UTC milliseconds
   *
   * @returns {Array[]} [[date,value],[date,value],....]
   * @memberof Station
   */
  linePlot() {
    this.processed.data = this.processed.data.map(d => {
      let dateArr = d[0].split("-");
      d[0] = Date.UTC(dateArr[0], dateArr[1], dateArr[2]);
      return d;
    });
    return this;
  }
  /**
   * this.processed.data in now Array of 12 with all the Jan,Feb data
   *
   * @returns {Array[]}
   * @memberof Station
   */
  linePlotByMonth() {
    // NOTE: this might be better as a scatter plot
    let byMonth = utils.splitByMonth(this.processed.data);
    this.processed.data = byMonth.map(m => {
      m.map = m.map(d => {
        let dateArr = d[0].split("-");
        d[0] = Date.UTC(dateArr[0], dateArr[1], dateArr[2]);
        return d;
      });
      return m;
    });
    return this;
  }
}

/**
 * @global
 * @typedef {Object} StationInfo          - general info like **StationName** etc
 * @property {boolean} Active             - still being sampled?
 * @property {string} County              - US county
 * @property {string} ForkTribGroup       - i.e 'SYT' South Yuba Tributary
 * @property {string} LocalWaterBody      - actual stream, i.e. 'Poorman Creek'
 * @property {string} LocalWatershed      - larger watershed, i.e 'Yuba Watershed'
 * @property {string} StationCode         - alphanumeric Code
 * @property {number} StationID           - internal id
 * 

/**
* @global
* @typedef {Object}  StationVisit     - StationVisit complete station visit with date, notes and results
* @property {string} id               - unique ID of sitevisit
* @property {string} date             - date in 'YYYY-MM-DD'
* @property {string} notes            - notes of the sitevisit
* @property {Results}  results        - actual data gathered
*/

/**
 * @global
 * @typedef {Object} Results             - datapoints DO, Temp etc, but no date
 * @property {number} H2O_Temp           - water temp
 * @property {number} H2O_ph             - water pH
 * @property {number} H2O_DO             - water DO
 * @property {number} H2O_Turbidity      - water Turbidity
 * @property {number} H2O_Cond           - water Conductivity
 * @property {number} Air_Temp           - Air Temp
 */

/**
 * @global
 * @typedef {Object}  YearRange   - { startYear, endYear }
 * @property {number} startYear   - first year of records
 * @property {number} endYear     - last year of records
 */
