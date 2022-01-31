// Handle message react buttons

function reactButtons(message, reactHandlers, ms, maxMs, strictUser) {
    return new Promise(async (resolve, reject) => {
        let timer, maxTimer;
        let { client } = message;
        let resolvedStrictUser = client.users.resolve(strictUser);

        function resetTimer() {
            clearTimeout(timer);
            timer = setTimeout(timeout, ms);
        }

        function timeout() {
            clearTimeout(timer);
            clearTimeout(maxTimer);
            client.off("messageReactionAdd", handlerWrapperAdd);
            client.off("messageReactionRemove", handlerWrapperRemove);
            resolve(message);
        }

        async function handlerWrapperAdd(reaction, user) {
            if (user.id !== client.user.id && reaction.message.id === message.id && (!resolvedStrictUser || user.id === resolvedStrictUser.id)) {
                let handler = reactHandlers.find(handler => reaction.emoji.toString().includes(handler.emoji.toString()));
                if (handler) {
                    await handler.callback(reaction, user, true);
                    resetTimer();
                }
            }
        }

        async function handlerWrapperRemove(reaction, user) {
            if (user.id !== client.user.id && reaction.message.id === message.id && (!resolvedStrictUser || user.id === resolvedStrictUser.id)) {
                let handler = reactHandlers.find(handler => reaction.emoji.toString().includes(handler.emoji.toString()));
                if (handler) {
                    await handler.callback(reaction, user, false);
                    resetTimer();
                }
            }
        }

        client.on("messageReactionAdd", handlerWrapperAdd);
        client.on("messageReactionRemove", handlerWrapperRemove);
        timer = setTimeout(timeout, ms);
        if (maxMs) {
            maxTimer = setTimeout(timeout, maxMs);
        }
        for (let i = 0; i < reactHandlers.length; i++) {
            await message.react(reactHandlers[i].emoji);
        }
    });
};

module.exports = reactButtons;
