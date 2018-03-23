import chalk from "chalk";

console.log(chalk.green("Working"));

async function test() {
  await console.log("async");
}

test();
