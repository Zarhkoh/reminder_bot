const botInteractions = require('./bot_server-interactions');
const reminder = require('../commands/reminder');
const help = require('../commands/help');
const commands = require('../commands/commands');
const logs = require('./logs');
const prefix = process.env.COMMAND_PREFIX;

module.exports.commandList = async(message) => {
    // Detecte si le message vient de l'API
    if (message.webhookId);
    let args = message.content.slice(prefix.length).trim().split(/ +/);
    let command = args.shift().toLowerCase();
    setTimeout(() => message.delete(), 200);
    try {
        logs.guildInfo(message.guild.id, `${command} called by ${message.author.tag}(ID:${message.author.id}) (server:${message.guild.id}, channel:${message.channel.id}, args: ${args})`);
        switch (command) {
            case "spy":
                await botInteractions.sendServerInformations(args, message.channel);
                break;
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
            case "mondc":
                await botInteractions.sendDataCenterInformations(message.author, message.channel, args);
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
        if (error instanceof EvalError || error instanceof ReferenceError) {
            logs.error(`${command} called by ${message.author.tag}(ID:${message.author.id}): ${error.message} (server:${message.guild.id}, channel:${message.channel.id})`);
        } else {
            logs.guildWarn(message.guild.id, `${command} called by ${message.author.tag}(ID:${message.author.id}): ${error.message} (server:${message.guild.id}, channel:${message.channel.id})`);
        }
    }
}