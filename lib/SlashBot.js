const { Client } = require("discord.js");

class SlashBot extends Client {
    static #DEFAULT_OPTIONS = {
        forceCommands: false,
        verbose: false
    };

    #catchError = error => this.emit("error", error);

    constructor(options = {}, commands = []) {
        let wd = {
            ...SlashBot.#DEFAULT_OPTIONS,
            ...options
        };
        super(wd);
        this.commands = commands;
        this
            .on("ready", () => {
                if (this.options.verbose) {
                    console.log(`[SlashBot] Logged in as ${this.user.tag}`);
                }
            })
            .on("interactionCreate", interaction => {
                this.#handleInteraction(interaction)
                    .catch(this.#catchError);
            })
            .#init()
            .catch(this.#catchError);
    }

    async #init() {

    }

    async #handleInteraction(interaction) {
        if (this.options.verbose) {

        }
    }
}

module.exports = SlashBot;
