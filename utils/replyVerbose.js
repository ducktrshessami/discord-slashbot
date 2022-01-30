// Reply to an interaction and log the reply

const logMessage = require("./logMessage");

async function replyVerbose(interaction, options) {
    let response = (await interaction.reply(options)) || (interaction.ephemeral ? null : await interaction.fetchReply);
    if (response) {
        return logMessage(response);
    }
}

module.exports = replyVerbose;
