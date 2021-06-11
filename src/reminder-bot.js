require('dotenv').config();
const { DateTime } = require("luxon");
const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = process.env.COMMAND_PREFIX;
var fs = require('fs');
const db = require('./db_init');
const reminderBuilder = require('./builders/reminder.builder.ts');


db.init();

client.once('ready', () => {
    console.log('Bot Ready');
});

client.login(process.env.BOT_TOKEN);

client.on('message', message => {
    if (message.content.startsWith(prefix) && message.content.charAt(1) != " " && !message.author.bot) {
        console.log(message.content + " de " + message.author);
        message.delete({ timeout: 200 });
        let args = message.content.slice(prefix.length).trim().split(/ +/);
        let command = args.shift().toLowerCase();
        switch (command) {
            case "repeat":
                fs.appendFile(`${process.env.LOGS_FOLDER}/${message.guild.id}.log`, `[INFO][${DateTime.now().toFormat('dd/LL/yyyy HH:mm:ss')}] ${command} called by ${message.author} (server:${message.channel.guild.id}, channel:${message.channel.id})\n`, function(err) {
                    if (err) console.log("ERREUR: ", err);
                });
                repeat(args.join(" "), message.channel);
                break;
            case "reminder":
                fs.appendFile(`${process.env.LOGS_FOLDER}/${message.guild.id}.log`, `[INFO][${DateTime.now().toFormat('dd/LL/yyyy HH:mm:ss')}] ${command} called by ${message.author} (server:${message.channel.guild.id}, channel:${message.channel.id})\n`, function(err) {
                    if (err) console.log("ERREUR: ", err);
                });
                addReminder(args, message.author, message.channel, message.guild);
                break;
            default:
                fs.appendFile(`${process.env.LOGS_FOLDER}/${message.guild.id}.log`, `[WARN][${DateTime.now().toFormat('dd/LL/yyyy HH:mm:ss')}] ${command} called by ${message.author} (server:${message.channel.guild.id}, channel:${message.channel.id})\n`, function(err) {
                    if (err) console.log("ERREUR: ", err);
                });
                sendError(message.channel.id, `${command} n'est pas une commande valide.`);
        }
    }

    function repeat(message, channel) {
        channel.send(`\`${message}\`>🦜`);
    }


    // Fonction qui enregistre un rappel en bdd
    function addReminder(args, author, channel) {
        try {
            //parse de la date
            let date = DateTime.fromFormat(`${args.shift()} ${args.shift()}`, "dd/MM/yyyy HH:mm");
            if (!date.isValid) {
                throw 'Format de la commande: `<dd/mm/yyyy> <HH:mm> <message>`';
            }
            if (date < DateTime.now()) {
                throw 'Le rappel doit être pour le futur, pas le passé. Petit clown ! 🤡 '
            }
            let reminder = {
                dateCreation: DateTime.now().toSQL(),
                dateRappel: date.toSQL(),
                author: author.id,
                serverId: channel.guild.id,
                channelId: channel.id,
                message: args.join(" ")
            };
            console.log("reminder créé avec le message " + message);
            reminderBuilder.setReminder(reminder).then(() => {
                console.log("reminder ajouté");
                channel.send(`Le rappel de ${author} est programmé pour le **${date.setLocale('fr').toFormat("cccc dd MMMM yyyy à hh:mm")}**. *Je n'oublierai pas.*`);
            });

        } catch (error) {
            sendError(channel.id, error);
        }
    }

    async function sendError(channelId, errorMsg) {
        console.log("sendError reached", errorMsg);
        let channel = client.channels.cache.find(channel => channel.id === channelId);
        await channel.send(errorMsg).then(msg => {
            msg.delete({ timeout: process.env.ERROR_MSG_DELETE_DELAY })
        });
    }

    function remindEm(channelId, author, message, originalDate) {
        let channel = client.channels.cache.find(channel => channel.id === channelId);
        console.log("CHANNEL:", channel);
        channel.send(`📌 **RAPPEL:** ${message} (créé le ${originalDate.setLocale('fr').toFormat("dd/MM/yyyy à hh:mm")} par ${author})`);
    }
});