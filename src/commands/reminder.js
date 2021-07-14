const reminderBuilder = require('../builders/reminder.builder');
const prefix = process.env.COMMAND_PREFIX;
const { DateTime } = require("luxon");
const logs = require('../controllers/logs');
const app = require('../reminder-bot');

// Fonction qui enregistre un rappel en bdd
module.exports.addReminder = (args, author, channel) => {
    let date = DateTime.fromFormat(`${args.shift()} ${args.shift()}`, "dd/MM/yyyy HH:mm");
    if (!date.isValid) {
        throw new SyntaxError(`Format de la commande : \`${prefix}reminder dd/mm/yyyy HH:mm message\``);
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
}


//Send back the reminder when it's time to do it
module.exports.remindEm = (guildId, channelId, authorId, message, originalDate) => {
    logs.guildInfo(guildId, `Reminder retrieved (server:${guildId}, channel:${channelId},author: ${authorId})\n`);
    if (app.client.guilds.cache.find(guild => guild.id === guildId).available) {
        try {
            let channel = app.client.channels.cache.find(channel => channel.id === channelId);
            channel.send(`📌** __RAPPEL:__ ${message}** *(créé le ${DateTime.fromFormat(originalDate, "dd/LL/yyyy HH:mm:ss").toFormat("dd/MM/yyyy à HH:mm")} par <@${authorId}>)*`);
        } catch (error) {
            logs.guildError(guildId, `[ERROR][${DateTime.now().toFormat('dd/LL/yyyy HH:mm:ss')}] function remindEm() Rappel non remis: ${error.message} (server:${guildId}, channel:${channelId}, rappel: ${message})\n`);
        }
    } else {
        logs.guildError(guildId, `function remindEm() Bot absent sur le serveur?: server:${guildId}, channel:${channelId}, autor:${authorId},  message: ${message}\n`);
    }
}


// CRON that check reminders to remind
module.exports.checkforRemindersToRemind = async() => {
    await reminderBuilder.getReminderByDateTime(DateTime.now().toFormat("dd/LL/yyyy HH:mm:00")).then(reminders => {
        if (reminders.length > 0) {
            reminders.forEach(reminder => {
                this.remindEm(reminder.serverId, reminder.channelId, reminder.author, reminder.message, reminder.dateCreation);
            });
        }
    });
}