import chalk from "chalk";
import { stations, loadedStations } from "./data";
import Station from "./Station";
import { getDataForYearRange, getParams } from "./utils";

let one = new Station(stations[0], loadedStations[0].data);

// console.log(one);
let test = getDataForYearRange(one.data, {
  startYear: 2010,
  endYear: 2015
});
let p = getParams(test);

console.log("p", p);
