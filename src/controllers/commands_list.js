const botInteractions = require('./bot_server_interactions');
const botReminder = require('../commands/bot_reminder');
const logs = require('./logs');
const prefix = process.env.COMMAND_PREFIX;

module.exports.commandList = (message) => {
    message.delete({ timeout: 200 });
    let args = message.content.slice(prefix.length).trim().split(/ +/);
    let command = args.shift().toLowerCase();
    try {
        logs.guildInfo(message.guild.id, `${command} called by ${message.author} (server:${message.guild.id}, channel:${message.channel.id})\n`);
        switch (command) {
            case "repeat":
                botInteractions.repeatUserMessage(args.join(" "), message.channel);
                break;
            case "reminder":
                botReminder.addReminder(args, message.author, message.channel, message.guild);
                break;
            case ".-":
                botInteractions.userIsBored(message.author, message.channel);
                break;
            default:
                botInteractions.sendErrorMsg(message.channel, `\`${prefix}${command}\` n'est pas une commande valide.`);
        }
    } catch (error) {
        if (error instanceof SyntaxError) {
            botInteractions.sendErrorMsg(message.channel, error.message);
        }
        logs.guildWarn(message.guild.id, `${command} called by ${message.author}: ${error.message} (server:${message.guild.id}, channel:${message.channel.id})\n`);
    }

}