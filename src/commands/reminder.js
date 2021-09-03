const reminderBuilder = require('../builders/reminder.builder');
const botInteractions = require('../controllers/bot_server-interactions');
const prefix = process.env.COMMAND_PREFIX;
const { DateTime } = require("luxon");
const logs = require('../controllers/logs');
const app = require('../reminder-bot');
const { MessageEmbed } = require('discord.js');

// Fonction qui enregistre un rappel en bdd
module.exports.addReminder = async(args, author, channel) => {
    let date = DateTime.fromFormat(`${args.shift()} ${args.shift()}`, "dd/MM/yyyy HH:mm");
    if (!date.isValid) {
        throw new SyntaxError(`Format de la commande : \`${prefix}remindme dd/mm/yyyy HH:mm message\``);
    }
    if (date < DateTime.now()) {
        throw new SyntaxError('Le rappel doit être pour le futur, pas le passé. Petit clown ! 🤡 ');
    }
    if (args.length == 0) {
        throw new SyntaxError(`Tu n\'aurais pas oublié d\'ajouter un message à ton rappel ? \n Format de la commande : \`${prefix}reminder dd/mm/yyyy HH:mm message\``);
    }
    let reminder = {
        dateCreation: DateTime.now().toFormat("dd/LL/yyyy HH:mm:ss"),
        dateRappel: date.toFormat("dd/LL/yyyy HH:mm:00"),
        authorId: author.id,
        targetId: author.id,
        authorUsername: author.username,
        serverId: channel.guild.id,
        channelId: channel.id,
        message: args.join(" ")
    };
    await reminderBuilder.setReminder(reminder).then(async() => {
        await botInteractions.sendMessage(channel, `Rappel enregistré, ${author}! Il est programmé pour le **${date.setLocale('fr').toFormat("cccc dd MMMM yyyy à HH:mm")}**. *Je n'oublierai pas.*`);
    });
}

module.exports.remindEm = async(reminder) => {
    logs.guildInfo(reminder.serverId, `Reminder ${reminder.reminderId} retrieved (server:${reminder.serverId}, channel:${reminder.channelId},author: ${reminder.authorId})`);
    if (app.client.guilds.cache.find(guild => guild.id === reminder.serverId).available) {
        let channel = app.client.channels.cache.find(channel => channel.id === reminder.channelId);
        // Build Embed to send
        const embed = new MessageEmbed();
        embed.setColor("#f2c311");
        embed.setAuthor("RAPPEL", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/pushpin_1f4cc.png");
        embed.setTitle(`${reminder.message}`);
        footer = `créé le ${DateTime.fromFormat(reminder.dateCreation, "dd/LL/yyyy HH:mm:ss").toFormat("dd/MM/yyyy à HH:mm")} par ${reminder.authorUsername} (${reminder.authorId})`;
        embed.setFooter(footer);
        //add a message to tag the target
        header = `Hey <@${reminder.targetId}>`
            // Send embed
        await botInteractions.sendEmbedWithHeader(header, embed, channel);
        await reminderBuilder.deleteReminderByUserAndId(reminder.authorId, reminder.reminderId);
    } else {
        throw new Error(`function remindEm() Bot absent sur le serveur?: server:${guildId}, channel:${channelId}, autor:${author},  message: ${message}`);
    }
}

// CRON that check reminders to remind
module.exports.checkforRemindersToRemind = async() => {
    await reminderBuilder.getReminderByDateTime(DateTime.now().toFormat("dd/LL/yyyy HH:mm:00")).then(reminders => {
        if (reminders.length > 0) {
            reminders.forEach(reminder => {
                this.remindEm(reminder);
            });
        }
    });
}

module.exports.sendRemindersList = async(author, guild) => {
    await reminderBuilder.getRemindersByUserAndServer(author.id, guild.id).then(async(reminders) => {
        if (reminders.length > 0) {
            const embed = new MessageEmbed();
            embed.setColor("#f2c311");
            embed.setAuthor(`Liste de tes rappels sur ${guild.name}**`, `https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/pushpin_1f4cc.png`);
            //add a message to tag the target
            let liste = "";
            reminders.forEach(reminder => {
                liste +=
                    `**${String(reminder.message).toUpperCase()}** *(id:${reminder.reminderId})*
                        *Créé le ${DateTime.fromFormat(reminder.dateCreation, "dd/LL/yyyy HH:mm:ss").toFormat('dd/LL/yyyy à HH:mm')}*
                        *Rappel prévu le ${DateTime.fromFormat(reminder.dateRappel, "dd/LL/yyyy HH:mm:ss").toFormat('dd/LL/yyyy à HH:mm')}*
    
                    `;
                embed.setDescription(liste);
            });
            await botInteractions.sendDM(author, embed);

        } else {
            await botInteractions.sendDM(author, `Tu n'as pas de rappels programmés sur le serveur ${guild.name}.`);
        }
    });
}

module.exports.deleteReminder = async(author, channel, reminderId) => {
    if (isNaN(reminderId)) {
        throw new SyntaxError(`La commande ${prefix}deletereminder doit comporter l'id d'un rappel t'appartenant. Exemple : \`${prefix}deletereminder 135\``);
    } else {
        await reminderBuilder.deleteReminderByUserAndId(author.id, reminderId).then(isdelete => {
            if (isdelete == 1) {
                botInteractions.sendMessage(channel, `Le rappel n°${reminderId} de ${author} est supprimé !`);
            } else {
                throw new SyntaxError(`Désolé ${author}, on dirait que le rappel n'existe pas ou que tu n'en es pas le propriétaire.`);
            }
        })
    }
}