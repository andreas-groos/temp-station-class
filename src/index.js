import chalk from "chalk";
import { stations, loadedStations } from "./data";
import Station from "./Station";
import { getParams } from "./utils";

let purdon = new Station(stations[0], loadedStations[0].data);
// one.setYearRange({ startYear: 2014, endYear: 2014 });
console.time("t");
purdon
  .setYearRange({ startYear: 2005, endYear: 2014 })
  .setParam("H2O_Temp")
  .bufferData()
  .roundTo(1)
  .boxPlotPerStation();
console.log(purdon.processed.data);
console.timeEnd("t");
