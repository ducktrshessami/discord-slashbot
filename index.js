const SlashBot = require("./lib/SlashBot");

Object.defineProperties(SlashBot, {
    Command: {
        value: require("./lib/Command"),
        enumerable: true
    }
});

module.exports = SlashBot;
