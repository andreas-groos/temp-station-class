import * as utils from "./utils";
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
  initMeta() {
    let totalYearRange = utils.totalYearRange(this.data);
    let params = utils.getParams(this.data);
    let range = utils.getDataForYearRange(this.data, {
      startYear: 2014,
      endYear: 2015
    });

    // let dataPointsPerParam = utils.dataPointsPerParam(
    //   this.data,
    //   totalYearRange
    // );
    return { totalYearRange, params };
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
