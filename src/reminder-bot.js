require('dotenv').config();
const { DateTime } = require("luxon");
const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = process.env.COMMAND_PREFIX;
var fs = require('fs');
const db = require('./db_init');
const reminderBuilder = require('./builders/reminder.builder.ts');
const cron = require("node-cron");

db.init();

client.once('ready', () => {
    try {
        fs.appendFile(`${process.env.LOGS_FOLDER}/bot.log`, `[INFO][${DateTime.now().toFormat('dd/LL/yyyy HH:mm:ss')}] BOT DÉMARRÉ\n`, function(err) {
            if (err) fatalError(err);
        });
    } catch (error) {
        fatalError(error);
    }
});

client.login(process.env.BOT_TOKEN);

// schedule tasks to be run on the server   
cron.schedule("0 * * * * *", function() {
    checkforRemindersToRemind();
});

client.on('message', message => {
    if (message.content.startsWith(prefix) && message.content.charAt(1) != " " && !message.author.bot) {
        message.delete({ timeout: 200 });
        let args = message.content.slice(prefix.length).trim().split(/ +/);
        let command = args.shift().toLowerCase();
        switch (command) {
            case "repeat":
                fs.appendFile(`${process.env.LOGS_FOLDER}/${message.guild.id}.log`, `[INFO][${DateTime.now().toFormat('dd/LL/yyyy HH:mm:ss')}] ${command} called by ${message.author} (server:${message.channel.guild.id}, channel:${message.channel.id})\n`, function(err) {
                    if (err) fatalError(err);
                });
                repeat(args.join(" "), message.channel);
                break;
            case "reminder":
                fs.appendFile(`${process.env.LOGS_FOLDER}/${message.guild.id}.log`, `[INFO][${DateTime.now().toFormat('dd/LL/yyyy HH:mm:ss')}] ${command} called by ${message.author} (server:${message.channel.guild.id}, channel:${message.channel.id})\n`, function(err) {
                    if (err) fatalError(err);
                });
                addReminder(args, message.author, message.channel, message.guild);
                break;
            case ".-":
                fs.appendFile(`${process.env.LOGS_FOLDER}/${message.guild.id}.log`, `[INFO][${DateTime.now().toFormat('dd/LL/yyyy HH:mm:ss')}] ${command} called by ${message.author} (server:${message.channel.guild.id}, channel:${message.channel.id})\n`, function(err) {
                    if (err) fatalError(err);
                });
                userIsBored(message.author, message.channel);
                break;
            default:
                fs.appendFile(`${process.env.LOGS_FOLDER}/${message.guild.id}.log`, `[WARN][${DateTime.now().toFormat('dd/LL/yyyy HH:mm:ss')}] ${command} called by ${message.author} (server:${message.channel.guild.id}, channel:${message.channel.id})\n`, function(err) {
                    if (err) fatalError(err);
                });
                sendError(message.channel.id, `${command} n'est pas une commande valide.`);
        }
    }
});

function repeat(message, channel) {
    try {
        channel.send(`\`${message}\`>🦜`);

    } catch (error) {
        fs.appendFile(`${process.env.LOGS_FOLDER}/${message.guild.id}.log`, `[ERROR][${DateTime.now().toFormat('dd/LL/yyyy HH:mm:ss')}] ${command} by ${message.author} error: ${error} (server:${message.channel.guild.id}, channel:${message.channel.id})\n`, function(err) {
            if (err) fatalError(err);
        });
    }
}


// Fonction qui enregistre un rappel en bdd
function addReminder(args, author, channel) {
    try {
        let date = DateTime.fromFormat(`${args.shift()} ${args.shift()}`, "dd/MM/yyyy HH:mm");
        if (!date.isValid) {
            throw new SyntaxError(`Format de la commande ${prefix}reminder : dd/mm/yyyy HH:mm message`);
        }
        if (date < DateTime.now()) {
            throw new SyntaxError('Le rappel doit être pour le futur, pas le passé. Petit clown ! 🤡 ');
        }
        let reminder = {
            dateCreation: DateTime.now().toFormat("dd/LL/yyyy HH:mm:ss"),
            dateRappel: date.toFormat("dd/LL/yyyy HH:mm:00"),
            author: author.id,
            serverId: channel.guild.id,
            channelId: channel.id,
            message: args.join(" ")
        };
        reminderBuilder.setReminder(reminder).then(() => {
            channel.send(`Le rappel de ${author} est programmé pour le **${date.setLocale('fr').toFormat("cccc dd MMMM yyyy à HH:mm")}**. *Je n'oublierai pas.*`);
        });

    } catch (error) {
        if (error instanceof SyntaxError) {
            sendError(channel.id, error.message);
        } else {
            fs.appendFile(`${process.env.LOGS_FOLDER}/${message.guild.id}.log`, `[ERROR][${DateTime.now().toFormat('dd/LL/yyyy HH:mm:ss')}] ${command} by ${message.author} error: ${error} (server:${message.channel.guild.id}, channel:${message.channel.id})\n`, function(err) {
                if (err) fatalError(err);
            });
        }
    }
}

async function sendError(channelId, errorMsg) {
    try {
        let channel = client.channels.cache.find(channel => channel.id === channelId);
        await channel.send(errorMsg).then(msg => {
            msg.delete({ timeout: process.env.ERROR_MSG_DELETE_DELAY })
        });
    } catch (error) {
        fs.appendFile(`${process.env.LOGS_FOLDER}/${message.guild.id}.log`, `[FATAL][${DateTime.now().toFormat('dd/LL/yyyy HH:mm:ss')}],BROKEN sendError(), error: ${error}, (channel:${channelId})\n`, function(err) {
            if (err) fatalError(err);
        });
    }

}


async function checkforRemindersToRemind() {
    await reminderBuilder.getReminderByDateTime(DateTime.now().toFormat("dd/LL/yyyy HH:mm:00")).then(reminders => {
        if (reminders.length > 0) {
            reminders.forEach(reminder => {
                remindEm(reminder.serverId, reminder.channelId, reminder.author, reminder.message, reminder.dateCreation);
            });
        }
    });
}

function userIsBored(author, channel) {
    try {
        channel.send(`Je crois que ${author} est blasé. 😒`);
    } catch (error) {
        fs.appendFile(`${process.env.LOGS_FOLDER}/${message.guild.id}.log`, `[ERROR][${DateTime.now().toFormat('dd/LL/yyyy HH:mm:ss')}] function isBored() @136 Message fail: ${error} (server:${guildId}, channel:${channel.id}\n`, function(err) {
            if (err) fatalError(err);
        });
    }
}

//Send back the reminder when it's time to do it
function remindEm(guildId, channelId, authorId, message, originalDate) {
    fs.appendFile(`${process.env.LOGS_FOLDER}/${guildId}.log`, `[INFO][${DateTime.now().toFormat('dd/LL/yyyy HH:mm:ss')}] Reminder retrieved (server:${guildId}, channel:${channelId},author: ${authorId})\n`, function(err) {
        if (err) fatalError(err);
    });
    if (client.guilds.cache.find(guild => guild.id === guildId).available) {
        try {
            let channel = client.channels.cache.find(channel => channel.id === channelId);
            channel.send(`📌** __RAPPEL:__ ${message}** *(créé le ${new DateTime(originalDate).setLocale('fr').toFormat("dd/MM/yyyy à HH:mm")} par <@${authorId}>)*`);
        } catch (error) {
            fs.appendFile(`${process.env.LOGS_FOLDER}/${message.guild.id}.log`, `[ERROR][${DateTime.now().toFormat('dd/LL/yyyy HH:mm:ss')}] function remindEm() @133 Rappel non remis: ${error} (server:${guildId}, channel:${channelId}, rappel: ${message})\n`, function(err) {
                if (err) fatalError(err);
            });
        }

    } else {
        fs.appendFile(`${process.env.LOGS_FOLDER}/${message.guild.id}.log`, `[ERROR][${DateTime.now().toFormat('dd/LL/yyyy HH:mm:ss')}] function remindEm() @133 Bot absent sur le serveur?: server:${guildId}, channel:${channelId}, autor:${authorId},  message: ${message}\n`, function(err) {
            if (err) fatalError(err);
        });
    }
}

function fatalError(error) {
    fs.appendFile(`${process.env.LOGS_FOLDER}/bot.log`, `[FATAL][${DateTime.now().toFormat('dd/LL/yyyy HH:mm:ss')}] unhandled error: ${error}\n`, function(err) {
        if (err) console.warn("ERREUR: ", err);
    });
}