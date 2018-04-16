import chalk from "chalk";
import { stations, loadedStations } from "./data";
import Station from "./Station";
import { getParams } from "./utils";

let someStation = new Station(stations[2], loadedStations[2].data);
// one.setYearRange({ startYear: 2014, endYear: 2014 });
console.log("Station.info.StationName : ", someStation.info.StationName);
console.time("basic");
someStation
  .setYearRange({
    startYear: 2005,
    endYear: 2014
  })
  .setParam("H2O_Cond")
  .roundTo(-1)
  .bufferData();
console.log(someStation.processed.data);
console.timeEnd("basic");
console.log("------------------");
console.time("boxPlotByMonth");
someStation
  .setYearRange({
    startYear: 2000,
    endYear: 2017
  })
  .setParam("H2O_pH")
  .roundTo(2)
  .bufferData()
  .boxPlotPerMonth();
console.log(someStation.processed.data);
console.timeEnd("boxPlotByMonth");
console.log("------------------");

console.time("boxPlotByStation");
someStation
  .setYearRange({
    startYear: 2000,
    endYear: 2017
  })
  .setParam("H2O_pH")
  .roundTo(2)
  .bufferData()
  .boxPlotPerStation();
console.log(someStation.processed.data);
console.timeEnd("boxPlotByStation");
