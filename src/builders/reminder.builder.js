const db = require('../db_init');
const Reminder = require('../models').Reminder;

module.exports.setReminder = (reminder) => {
    return new Promise(async(resolve, reject) => {
        try {
            const result = await Reminder.create(reminder);
            resolve(result);
        } catch (err) {
            reject(err);
        }
    });
}

module.exports.getReminderByDateTime = (dateTime) => {
    return new Promise(async(resolve, reject) => {
        try {
            const result = await Reminder.findAll({
                where: {
                    dateRappel: dateTime
                }
            });
            resolve(result);
        } catch (err) {
            reject(err);
        }
    });
}

module.exports.getRemindersByUserAndServer = (userId, serverId) => {
    return new Promise(async(resolve, reject) => {
        try {
            const result = await Reminder.findAll({
                where: {
                    authorId: userId,
                    serverId: serverId
                }
            });
            resolve(result);
        } catch (err) {
            reject(err);
        }
    });
}

module.exports.deleteReminderByUserAndId = (userId, reminderId) => {
    return new Promise(async(resolve, reject) => {
        try {
            const result = await Reminder.destroy({
                where: {
                    reminderId: reminderId,
                    authorId: userId
                }
            });
            resolve(result);
        } catch (err) {
            reject(err);
        }
    });
}