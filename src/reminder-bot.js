require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});

const prefix = process.env.COMMAND_PREFIX;
const db = require('./db_init');
const cron = require("node-cron");
const commandList = require('./controllers/commands-list');
const logs = require('./controllers/logs');
const botReminder = require('./commands/reminder');

db.init();
module.exports.client = client;
client.once('ready', () => {
    logs.info('BOT DÉMARRÉ');
});

client.login(process.env.BOT_TOKEN);

// schedule tasks to be run on the server   
cron.schedule("0 * * * * *", function() {
    try {
        botReminder.checkforRemindersToRemind();
    } catch (error) {
        logs.error(error.message);
    }
});

client.on('messageCreate', message => {
    if (message.content.startsWith(prefix) && message.content.charAt(1) != " " && !message.author.bot) {
        commandList.commandList(message);
    }
});