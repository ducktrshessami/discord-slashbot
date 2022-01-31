// Log an interaction

function logInteraction(interaction) {
    let source = interaction.guildId ? `${interaction.guildId}/${interaction.channelId}` : interaction.channelId;
    if (interaction.isContextMenu()) {
        let target;
        if (interaction.targetType === "USER") {
            target = interaction.options.resolved.users.get(interaction.targetId)
                .tag;
        }
        else {
            target = `[${targetId}]`;
        }
        console.log(`[SlashBot ${source}] ${interaction.user.tag} used [${interaction.commandName}] on ${target}`);
    }
    else if (interaction.isCommand()) {
        console.log(`[SlashBot ${source}] ${interaction.user.tag} used /${interaction.commandName}`);
    }
    else if (interaction.isButton()) {
        console.log(`[SlashBot ${source}] ${interaction.user.tag} clicked on [${interaction.customId}]`);
    }
    else if (interaction.isSelectMenu()) {
        console.log(`[SlashBot ${source}] ${interaction.user.tag} selected [${interaction.values.join(", ")}] from [${interaction.customId}]`);
    }
    return interaction;
}

module.exports = logInteraction;
