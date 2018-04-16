import chalk from "chalk";
import { stations, loadedStations } from "./data";
import Station from "./Station";
import { getParams } from "./utils";

let someStation = new Station(stations[0], loadedStations[0].data);
console.log("Station.info.StationName : ", someStation.info.StationName);
// console.time("basic");
// someStation
//   .setYearRange({
//     startYear: 2005,
//     endYear: 2014
//   })
//   .setParam("H2O_Cond")
//   .roundTo(-1)
//   .bufferData();
// console.log(someStation.processed.data);
// console.timeEnd("basic");
// console.log("------------------");
// console.time("boxPlotByMonth");
// someStation
//   .setYearRange({
//     startYear: 2000,
//     endYear: 2017
//   })
//   .setParam("H2O_pH")
//   .roundTo(2)
//   .bufferData()
//   .boxPlotPerMonth();
// console.log(someStation.processed.data);
// console.timeEnd("boxPlotByMonth");
// console.log("------------------");

// console.time("boxPlotByStation");
// someStation
//   .setYearRange({
//     startYear: 2000,
//     endYear: 2017
//   })
//   .setParam("H2O_pH")
//   .roundTo(2)
//   .bufferData()
//   .boxPlot();
// console.log(someStation.processed.data);
// console.timeEnd("boxPlotByStation");

// console.log("------------------");
// console.time("linePlot");
// someStation
//   .setYearRange({ startYear: 2014, endYear: 2014 })
//   .setParam("H2O_pH")
//   .bufferData()
//   .linePlot();
// console.log(someStation.processed.data);
// console.timeEnd("linePlot");

// console.log("------------------");
// console.time("linePlotByMonth");
// someStation
//   .setYearRange({ startYear: 2012, endYear: 2014 })
//   .setParam("H2O_pH")
//   .bufferData()
//   .linePlotByMonth();
// console.log(someStation.processed.data);
// console.timeEnd("linePlotByMonth");

console.time("csv");
let csvTest = someStation
  .setYearRange({ startYear: 2000, endYear: 2015 })
  .getCSV(true);
console.log("csvTest");
console.log(csvTest.processed.data);
console.timeEnd("csv");
