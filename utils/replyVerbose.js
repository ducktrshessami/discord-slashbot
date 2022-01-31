// Reply to a message and log the reply

const logMessage = require("./logMessage");

function replyVerbose(message, options) {
    return message.reply(options)
        .then(response => response ? response : (message.fetchReply && !message.ephemeral ? message.fetchReply() : null))
        .then(response => {
            if (response) {
                return logMessage(response);
            }
        });
}

module.exports = replyVerbose;
