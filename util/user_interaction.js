const readline = require("readline");
const chalk = require("chalk").default;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const question = (text) => new Promise((resolve) => rl.question(text, resolve))
const questionSync = (text) => rl.question(text)

// Text Coloring
const BLUE = (text) => {
    return chalk.blueBright.bold(`${text}`);
}

const GREEN = (text) => {
    return chalk.greenBright.bold(`${text}`);
}

const RED = (text) => {
    return chalk.redBright.bold(`${text}`);
}

const YELLOW = (text) => {
    return chalk.yellowBright.bold(`${text}`);
}

const GREENBG = (text) => {
    return chalk.greenBright.inverse.bold(` ${text} `);
}

const REDBG = (text) => {
    return chalk.redBright.inverse.bold(` ${text} `);
}

const YELLOWBG = (text) => {
    return chalk.yellowBright.inverse.bold(` ${text} `);
}

const BLUEBG = (text) => {
    return chalk.blueBright.inverse.bold(` ${text} `);
}

module.exports = {
    question,
    questionSync,
    GREEN,
    RED,
    YELLOW,
    GREENBG,
    REDBG,
    YELLOWBG,
    BLUEBG,
    BLUE
}
