declare module "discord-slashbot" {
    import Discord from "discord.js"

    interface SlashBotOptions extends Discord.ClientOptions {
        forceCommands: Boolean,
        verbose: Boolean
    }

    type CommandPermissionOption = {
        guild: Discord.GuildResolvable,
        permissions: Array<Discord.ApplicationCommandPermissionData>
    };

    class SlashBot extends Discord.Client {
        constructor(options?: SlashBotOptions, commands?: Array<SlashBot.Command>);
    }

    namespace SlashBot {
        class Command {
            public readonly client: SlashBot;
            public readonly applicationCommand: Discord.ApplicationCommand;
            public name: String;
            public description: String;
            public guildID: Discord.Snowflake;
            public options: Array<Discord.ApplicationCommandOptionData>;
            public defaultPermission: Boolean;
            public permissionOptions: Array<CommandPermissionOption>;
            public requireGuild: Boolean;
            public requirePerms: Array<Discord.PermissionResolvable>;

            private callback: (interaction: Discord.CommandInteraction) => void;

            constructor(
                name: String,
                callback: (this: Command, interaction: Discord.CommandInteraction) => void,
                options?: {
                    description?: String,
                    guildID?: Discord.Snowflake,
                    options?: Discord.ApplicationCommandOptionData | Array<Discord.ApplicationCommandOptionData>,
                    defaultPermission?: Boolean,
                    permissionOptions?: CommandPermissionOption | Array<CommandPermissionOption>,
                    requireGuild?: Boolean,
                    requirePerms?: Discord.PermissionResolvable
                }
            );

            public check(interaction: Discord.Interaction): Boolean;
            public exec(interaction: Discord.CommandInteraction): void;
            public toJSON(): {
                name: String,
                description: String,
                type: "CHAT_INPUT",
                options: Array<Discord.ApplicationCommandOptionData>,
                defaultPermission: Boolean,
                default_permission: Boolean
            };

            private lackPerms(interaction: Discord.Interaction): void;
            private static lackGuild(interaction: Discord.Interaction): void;
        }

        namespace utils {
            function checkPartial(partial: Object): Promise<Object>;
            function followupVerbose(interaction: Discord.Interaction, options: String | Discord.InteractionReplyOptions | Discord.MessagePayload): Promise<Discord.Message>;
            function logInteraction(interaction: Discord.Interaction): Discord.Interaction;
            function logMessage(message: Discord.Message): Discord.Message;
            function reactButtons(
                message: Discord.Message,
                reactHandlers: Array<{
                    emoji: Discord.EmojiIdentifierResolvable,
                    callback: (reaction: Discord.MessageReaction, user: Discord.User, add: Boolean) => void;
                }>,
                ms: Number,
                maxMs?: Number,
                strictUser?: Discord.UserResolvable
            ): Promise<Discord.Message>;
            function replyVerbose(message: Discord.Message, options: String | Discord.MessageOptions | Discord.MessagePayload): Promise<Discord.Message>;
            function replyVerbose(interaction: Discord.Interaction, options: String | Discord.InteractionReplyOptions | Discord.MessagePayload): Promise<Discord.Message | void>;
            function sendPages(
                channel: Discord.TextChannel,
                pages: Array<String | Discord.MessageOptions | Discord.MessagePayload>,
                ms: Number,
                left?: Discord.EmojiIdentifierResolvable,
                right?: Discord.EmojiIdentifierResolvable,
                maxMs?: Number
            ): Promise<Discord.Message>;
            function sendVerbose(channel: Discord.TextChannel, options: String | Discord.MessageOptions | Discord.MessagePayload): Promise<Discord.Message>;
        }

        export { Command, utils };
    }

    export = SlashBot;
}
