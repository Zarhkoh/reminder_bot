const botInteractions = require('./bot_server-interactions');
const reminder = require('../commands/reminder');
const help = require('../commands/help');
const commands = require('../commands/commands');
const logs = require('./logs');
const prefix = process.env.COMMAND_PREFIX;

module.exports.commandList = async(message) => {
    message.delete({ timeout: 200 });
    let args = message.content.slice(prefix.length).trim().split(/ +/);
    let command = args.shift().toLowerCase();
    try {
        logs.guildInfo(message.guild.id, `${command} called by ${message.author} (server:${message.guild.id}, channel:${message.channel.id}, args: ${args})`);
        switch (command) {
            case "reminders":
                await reminder.sendRemindersList(message.author, message.guild);
                break;
            case "commands":
                await commands.displayCommandList(message.channel);
                break;
            case "help":
                await help.commandList(message.channel);
                break;
            case "repeat":
                await botInteractions.repeatUserMessage(args.join(" "), message.channel);
                break;
            case "remindme":
                await reminder.addReminder(args, message.author, message.channel, message.guild);
                break;
            case "deletereminder":
                await reminder.deleteReminder(message.author, message.channel, args);
                break;
            case ".-":
                await botInteractions.userIsBored(message.author, message.channel);
                break;
            default:
                await botInteractions.sendErrorMsg(message.channel, `\`${prefix}${command}\` n'est pas une commande valide. \`${prefix}help\` pour avoir de l'aide.`);
        }
    } catch (error) {
        if (error instanceof SyntaxError) {
            botInteractions.sendErrorMsg(message.channel, error.message);
        }
        logs.guildWarn(message.guild.id, `${command} called by ${message.author}: ${error.message} (server:${message.guild.id}, channel:${message.channel.id})`);
    }
}