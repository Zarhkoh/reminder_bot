module.exports.repeatUserMessage = (message, channel) => {
    channel.send(`\`${message}\`>🦜`);
}

module.exports.sendMessage = async(channel, message) => {
    channel.send(message);
}

module.exports.userIsBored = (author, channel) => {
    channel.send(`Il semblerait que ${author} soit blasé. 😒`);
}

module.exports.sendErrorMsg = async(channel, errorMsg) => {
    await channel.send(errorMsg).then(msg => {
        msg.delete({ timeout: process.env.ERROR_MSG_DELETE_DELAY })
    });
}