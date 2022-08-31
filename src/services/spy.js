const got = require('got');


module.exports.getInfosFromInviteLink = async(inviteId) => {
    const response = await got(`https://discord.com/api/v10/invites/${inviteId}?with_counts=true`);
    return JSON.parse(response.body);
}