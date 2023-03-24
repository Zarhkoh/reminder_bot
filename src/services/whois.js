const whoiser = require('whoiser');


module.exports.getDataCenterByIp = async(ip) => {
    console.log(`On call l'api avec ${ip}`);
    return await whoiser(ip);
}