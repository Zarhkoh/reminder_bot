const { EmbedField, MessageEmbed } = require("discord.js");
const fs = require('fs');
const prefix = process.env.COMMAND_PREFIX;
const file = fs.readFileSync("src/assets/commandList.json");

module.exports.displayCommandList = (channel) => {
    const embed = new MessageEmbed();
    embed.setColor("#4CC6FF");
    embed.set
    embed.setAuthor("Liste des commandes", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/memo_1f4dd.png");
    JSON.parse(file).forEach(c => {
        embed.addField(`${c.commandSuffix}`, `${c.commandDescription}\n \`${prefix}${c.commandSyntax}\` \n \n `, false);
    });
    channel.send(embed);
}