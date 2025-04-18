const commandPrefix = "/";

let antiToxic = false;
const antiToxicToggle = () => {
    antiToxic = !antiToxic;
};

module.exports = {
    commandPrefix,
    antiToxicToggle,
    antiToxic,
};
