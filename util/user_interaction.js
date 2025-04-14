const readline = require("readline");
const chalk = require("chalk").default;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const question = rl.question

// Text Coloring
const GREEN = (text) => {
    return chalk.greenBright.inverse.bold(` ${text} `);
}

module.exports = {
    question
}
