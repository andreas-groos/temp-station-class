import chalk from "chalk";
import { stations, loadedStations } from "./data";
console.log(chalk.green("Working"));

async function test() {
  await console.log("async");
}

test();
