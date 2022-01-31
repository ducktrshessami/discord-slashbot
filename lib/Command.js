const replyVerbose = require("../utils/replyVerbose");

class Command {
    static #DEFAULT_OPTIONS = {
        description: " ",
        guildID: null,
        options: [],
        defaultPermission: true,
        permissionOptions: [],
        requireGuild: false,
        requirePerms: []
    }

    #callback;

    constructor(name, callback, options = {}) {
        this.name = name;
        this.#callback = callback;
        this.description = options.description || Command.#DEFAULT_OPTIONS.description;
        this.guildID = options.guildID || Command.#DEFAULT_OPTIONS.guildID;
        this.options = [].concat(options.options || Command.#DEFAULT_OPTIONS.options);
        this.defaultPermission = options.defaultPermission === undefined ? Command.#DEFAULT_OPTIONS.defaultPermission : Boolean(options.defaultPermission);
        this.permissionOptions = [].concat(options.permissionOptions || Command.#DEFAULT_OPTIONS.permissionOptions);
        this.requirePerms = options.requirePerms || Command.#DEFAULT_OPTIONS.requirePerms;
        this.requireGuild = Boolean(this.guildID || (this.requirePerms && this.requirePerms.length)) || (options.requireGuild === undefined ? Command.#DEFAULT_OPTIONS.requireGuild : Boolean(options.requireGuild));
    }

    check(interaction, execute = true) {
        if (interaction.isCommand() && (this.applicationCommand ? interaction.commandId === this.applicationCommand.id : (interaction.commandName === this.name && (!this.guildID || interaction.guildId === this.guildID)))) {
            let reqGuild = !this.requireGuild || interaction.guild;
            let reqPerms = !this.requirePerms || !this.requirePerms.length || (
                interaction.member
                && interaction.member.permissionsIn(interaction.channel)
                    .has(this.requirePerms)
            );
            if (execute) {
                if (!reqGuild) {
                    Command.#lackGuild(interaction);
                }
                else if (!reqPerms) {
                    this.#lackPerms(interaction);
                }
                else {
                    this.exec(interaction)
                        .catch(error => this.client.emit("error", error));
                }
            }
            return reqGuild && reqPerms;
        }
        else {
            return false;
        }
    }

    async exec(interaction) {
        await this.#callback(interaction);
    }

    toJSON() {
        return {
            name: this.name,
            description: this.description,
            type: "CHAT_INPUT",
            options: this.options,
            defaultPermission: this.defaultPermission,
            default_permission: this.defaultPermission
        };
    }

    #lackPerms(interaction) {
        let content = "You do not have permission to use this command here.";
        if (interaction.member) {
            let lacking = interaction.member.permissionsIn(interaction.channel)
                .missing(this.requirePerms, false)
                .map(perm => `\`${perm}\``)
                .join(", ");
            content = `You lack the following permissions in this channel: ${lacking}`;
        }
        replyVerbose(interaction, {
            content,
            ephemeral: true
        })
            .catch(console.error);
    }

    static #lackGuild(interaction) {
        replyVerbose(interaction, {
            content: "This command can only be used in a server.",
            ephemeral: true
        })
            .catch(console.error);
    }
}

module.exports = Command;
