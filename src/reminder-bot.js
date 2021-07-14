require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = process.env.COMMAND_PREFIX;
const db = require('./db_init');
const cron = require("node-cron");
const commandList = require('./controllers/commands_list');
const logs = require('./controllers/logs');
const botReminder = require('./commands/bot_reminder');

db.init();
module.exports = client;
client.once('ready', () => {
    logs.info('BOT DÉMARRÉ');
});

client.login(process.env.BOT_TOKEN);

// schedule tasks to be run on the server   
cron.schedule("0 * * * * *", function() {
    try {
        botReminder.checkforRemindersToRemind();
    } catch (error) {
        console.log("ok");
    }
});

client.on('message', message => {
    if (message.content.startsWith(prefix) && message.content.charAt(1) != " " && !message.author.bot) {
        commandList.commandList(message);
    }
});