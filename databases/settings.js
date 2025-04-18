const commandPrefix = "/";

let antiToxic = false;

/**
 * @returns Promise<boolean>
 */
const antiToxicToggle = () => {
    return new Promise((resolve) => {
        antiToxic = !antiToxic;
        resolve(antiToxic);
    });
};

module.exports = {
    commandPrefix,
    antiToxicToggle,
    antiToxic,
};
