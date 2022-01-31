// Send a message to a TextChannel and log it

const checkPartial = require("./checkPartial");
const logMessage = require("./logMessage");

function sendVerbose(channel, options) {
    return checkPartial(channel)
        .then(fetched => fetched.send(options))
        .then(logMessage);
};

module.exports = sendVerbose;
