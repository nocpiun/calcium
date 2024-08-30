"use strict";

const { exec } = require("child_process");
const path = require("path");

const chalk = require("react-dev-utils/chalk");
const express = require("express");

console.log(chalk.cyan("Building Calcium in production mode...\n"));

exec("npm run build", (err) => {
    if(err) {
        console.log(chalk.red(err));

        return;
    }

    const app = express();

    app.use(express.static(path.join(__dirname, "..", "build")));

    app.listen(3000, () => {
        console.log(
            chalk.green("Calcium is ready on"),
            chalk.greenBright(chalk.bold("http://localhost:3000"))
        );
    });
});
