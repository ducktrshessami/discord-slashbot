const { Client } = require("discord.js");
const logInteraction = require("../utils/logInteraction");

class SlashBot extends Client {
    static #DEFAULT_OPTIONS = {
        forceCommands: false,
        verbose: false,
        intents: "GUILDS"
    };

    #catchError = error => this.emit("error", error);

    constructor(options = {}, commands = []) {
        let wd = {
            ...SlashBot.#DEFAULT_OPTIONS,
            ...options
        };
        super(wd);
        this.commands = commands;
        this.presences = { list: [] };
        this
            .on("ready", () => {
                if (this.options.verbose) {
                    console.log(`[SlashBot] Logged in as ${this.user.tag}`);
                }
                this.init()
                    .catch(this.#catchError);
            })
            .on("interactionCreate", interaction => {
                this.#handleInteraction(interaction)
                    .catch(this.#catchError);
            });
    }

    async init() {
        let cache = await Promise.all(
            this.guilds.cache.map(guild => guild.commands.fetch())
                .concat(this.application.commands.fetch())
        ).then(caches => caches[0].concat(...caches.slice(1)));
        if (this.options.forceCommands) {
            if (this.options.verbose) {
                console.log("[SlashBot] Deleting all existing commands");
            }
            await Promise.all(cache.map(command => command.delete()));
            cache.clear();
        }
        return Promise.all(this.commands.map(async command => {
            let registered = cache.find(cmd => cmd.name === command.name && (!command.guildID || cmd.guildId === command.guildID));
            if (!registered) {
                if (this.options.verbose) {
                    console.log(`[SlashBot] Creating command ${command.name} with guild ID ${command.guildID}`);
                }
                registered = await this.application.commands.create(command.toJSON(), command.guildID);
                await Promise.all(command.permissionOptions.map(options => registered.permissions.set(options)));
            }
            Object.defineProperties(command, {
                client: {
                    value: this,
                    enumerable: true
                },
                applicationCommand: {
                    value: registered,
                    enumerable: true
                }
            });
        }));
    }

    async #handleInteraction(interaction) {
        if (this.options.verbose) {
            console.log(`[SlashBot] Received interaction ${interaction.id}`);
            logInteraction(interaction);
        }
        return this.commands.some(command => command.check(interaction));
    }

    loopPresences(list, minutes, shuffle = true) { // Set periodic presences
        this.presences = {};
        this.presences.list = list;
        this.presences.ms = minutes * 60000;
        this.presences.shuffle = shuffle;
        this.presences.last = list.length;
        this.newPresence();
    }

    newPresence(presence, time, foo = this) { // Update current presence
        if (foo.pTimeout) {
            clearTimeout(foo.pTimeout);
        }
        if (!(presence && time) && foo.presences.list.length && foo.presences.ms) { // If looping set presences
            time = foo.presences.ms;
            if (foo.presences.shuffle) {
                foo.presences.last = Math.floor(Math.random() * foo.presences.list.length);
                presence = foo.presences.list[foo.presences.last];
            }
            else {
                if (++foo.presences.last >= foo.presences.list.length) {
                    foo.presences.last = 0;
                }
                presence = foo.presences.list[foo.presences.last];
            }
        }
        if (presence && time) { // If setting a specified presence
            if (this.options.verbose) {
                console.log("[SlashBot] Setting new presence");
            }
            foo.user.setPresence(presence);
            foo.pTimeout = setTimeout(foo.newPresence, time, null, null, foo);
        }
        else {
            if (this.options.verbose) {
                console.log("[SlashBot] Clearing presence");
            }
            foo.user.setPresence(null);
        }
    }
}

module.exports = SlashBot;
