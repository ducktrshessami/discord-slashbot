const replyVerbose = require("../utils/replyVerbose");

// Default slash command options
const defaultCMDOptions = {
    description: " ",
    guildID: null,
    options: [],
    defaultPermission: true,
    permissionOptions: [],
    requireGuild: false,
    requirePerms: []
}

class Command {
    #callback;

    constructor(name, callback, options = {}) {
        this.name = name;
        this.#callback = callback;
        this.description = options.description || defaultCMDOptions.description;
        this.guildID = options.guildID || defaultCMDOptions.guildID;
        this.options = [].concat(options.options || defaultCMDOptions.options);
        this.defaultPermission = options.defaultPermission === undefined ? defaultCMDOptions.defaultPermission : Boolean(options.defaultPermission);
        this.permissionOptions = [].concat(options.permissionOptions || defaultCMDOptions.permissionOptions);
        this.requirePerms = options.requirePerms || defaultCMDOptions.requirePerms;
        this.requireGuild = Boolean(this.guildID || (this.requirePerms && this.requirePerms.length)) || (options.requireGuild === undefined ? defaultCMDOptions.requireGuild : Boolean(options.requireGuild));
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
                    this.exec(interaction);
                }
            }
            return reqGuild && reqPerms;
        }
        else {
            return false;
        }
    }

    exec(interaction) {
        this.#callback(interaction);
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
