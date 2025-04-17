const { chatLog } = require("./chat_log");
const {
    question,
    questionSync,
    GREEN,
    RED,
    YELLOW,
    GREENBG,
    REDBG,
    YELLOWBG,
    BLUEBG,
    BLUE,
} = require("./user_interaction");

module.exports = {
    chatLog,
    question,
    questionSync,
    GREEN,
    RED,
    YELLOW,
    GREENBG,
    REDBG,
    YELLOWBG,
    BLUEBG,
    BLUE,
    toTitleCase: (str) => {
        if (!str) {
            return "";
        }
        return str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
    },
};
