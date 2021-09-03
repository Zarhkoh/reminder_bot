const { MessageEmbed } = require("discord.js");

module.exports.repeatUserMessage = (message, channel) => {
    channel.send(`\`${message}\`>🦜`);
}

module.exports.sendMessage = async(channel, message) => {
    channel.send(message);
}

module.exports.sendBasicEmbed = (title, message, channel) => {
    const embed = new MessageEmbed();
    embed.setColor("#249cec");
    embed.setTitle(title);
    embed.setDescription(message);
    channel.send(embed);
}

module.exports.sendEmbed = (embed, channel) => {
    channel.send(embed);
}

module.exports.sendDM = (target, message) => {
    target.send(message);
}

module.exports.sendEmbedWithHeader = (header, embed, channel) => {
    channel.send(header, embed);
}

module.exports.userIsBored = (author, channel) => {
    channel.send(`Il semblerait que ${author} soit blasé. 😒`);
}

module.exports.sendErrorMsg = async(channel, errorMsg) => {
    await channel.send(errorMsg).then(msg => {
        msg.delete({ timeout: process.env.ERROR_MSG_DELETE_DELAY })
    });
}