var fs = require('fs');
const { DateTime } = require('luxon');
const botInteractions = require('./bot_server_interactions');

module.exports.info = (message) => {
    fs.appendFile(`${process.env.LOGS_FOLDER}/bot.log`, `[INFO][${DateTime.now().toFormat('dd/LL/yyyy HH:mm:ss')}] ${message}\n`, function(err) {
        if (err) fatal(err);
    });
}

module.exports.error = (error) => {
    fs.appendFile(`${process.env.LOGS_FOLDER}/bot.log`, `[ERROR][${DateTime.now().toFormat('dd/LL/yyyy HH:mm:ss')}] unhandled error: ${error}\n`, function(err) {
        if (err) console.warn("ERREUR: ", err);
    });
}

module.exports.guildInfo = (guildId, message) => {
    fs.appendFile(`${process.env.LOGS_FOLDER}/${guildId}.log`, `[INFO][${DateTime.now().toFormat('dd/LL/yyyy HH:mm:ss')}] ${message}\n`, function(err) {
        if (err) fatal(err);
    });
}

module.exports.guildWarn = (guildId, message) => {
    fs.appendFile(`${process.env.LOGS_FOLDER}/${guildId}.log`, `[WARN][${DateTime.now().toFormat('dd/LL/yyyy HH:mm:ss')}] ${message}\n`, function(err) {
        if (err) fatal(err);
    });
}

module.exports.guildError = (guildId, message) => {
    fs.appendFile(`${process.env.LOGS_FOLDER}/${guildId}.log`, `[ERROR][${DateTime.now().toFormat('dd/LL/yyyy HH:mm:ss')}] ${message}\n`, function(err) {
        if (err) fatal(err);
    });
}

// module.exports.wrongCommandCalled = (guildId, channelId, author, command) => {
//     fs.appendFile(`${process.env.LOGS_FOLDER}/${guildId}.log`, `[WARN][${DateTime.now().toFormat('dd/LL/yyyy HH:mm:ss')}] ${command} called by ${author} (server:${guildId}, channel:${channelId})\n`, function(err) {
//         if (err) fatal(err);
//     });
// }

// module.exports.commandError = (guildId, channelId, author, command, error) => {
//     fs.appendFile(`${process.env.LOGS_FOLDER}/${guildId}.log`, `[WARN][${DateTime.now().toFormat('dd/LL/yyyy HH:mm:ss')}] ${command} called by ${author}: ${error} (server:${guildId}, channel:${channelId})\n`, function(err) {
//         if (err) fatal(err);
//     });
// }