const db = require('../db_init');
const Reminder = require('../models').Reminder;

module.exports.setReminder = function(reminder) {
    console.log("builder atteint");
     return new Promise(async(resolve, reject) => {
         try {
             const result = await Reminder.create(reminder);
             
             console.log("enregistré?");
             resolve(result);
         } catch (err) {
             reject(err);
         }
     });
 }
