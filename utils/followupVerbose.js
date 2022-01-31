// Followup an interaction and log the message

const logMessage = require("./logMessage");

function followupVerbose(interaction, options) {
    return interaction.followUp(options)
        .then(logMessage);
}

module.exports = followupVerbose;
