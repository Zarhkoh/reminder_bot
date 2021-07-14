module.exports.repeatUserMessage = (message, channel) => {
    channel.send(`\`${message}\`>🦜`);
}

module.exports.userIsBored = (author, channel) => {
    channel.send(`Il semblerait que ${author} soit blasé. 😒`);
}

module.exports.sendErrorMsg = async(channel, errorMsg) => {
    // let channel = client.channels.cache.find(channel => channel.id === channelId);
    await channel.send(errorMsg).then(msg => {
        msg.delete({ timeout: process.env.ERROR_MSG_DELETE_DELAY })
    });
}