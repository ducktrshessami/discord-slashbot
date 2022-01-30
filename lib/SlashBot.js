const { Client } = require("discord.js");

class SlashBot extends Client {
    constructor(options, commands) {
        super(options);
    }
}

module.exports = SlashBot;
