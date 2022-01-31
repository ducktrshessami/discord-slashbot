// sendVerbose a message and set up handling for reacts to change the message content

const sendVerbose = require("./sendVerbose");
const reactButtons = require("./reactButtons");
const checkPartial = require("./checkPartial");

function sendPages(channel, pages, ms, left = "⬅️", right = "➡️", maxMs) {
    let i = 0;
    return checkPartial(channel)
        .then(fetched => sendVerbose(fetched, pages[i]))
        .then(message => {
            if (pages.length > 1) {
                return new Promise((resolve, reject) => {
                    reactButtons(message, [
                        {
                            emoji: left,
                            callback: () => {
                                if (--i < 0) {
                                    i = pages.length - 1;
                                }
                                message.edit(pages[i])
                                    .catch(reject);
                            }
                        },
                        {
                            emoji: right,
                            callback: () => {
                                if (++i >= pages.length) {
                                    i = 0;
                                }
                                message.edit(pages[i])
                                    .catch(reject);
                            }
                        }
                    ], ms, maxMs)
                        .then(resolve)
                        .catch(reject);
                });
            }
        });
};

module.exports = sendPages;
