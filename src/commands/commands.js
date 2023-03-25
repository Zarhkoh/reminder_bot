const { EmbedField, EmbedBuilder } = require("discord.js");
const fs = require('fs');
const prefix = process.env.COMMAND_PREFIX;
const file = fs.readFileSync("src/assets/commandList.json");

module.exports.displayCommandList = (channel) => {
    const embed = new EmbedBuilder();
    embed.setColor("#4CC6FF");
    embed.setAuthor({ name: "Liste des commandes", iconURL: "https://em-content.zobj.net/thumbs/120/twitter/322/memo_1f4dd.png" });
    JSON.parse(file).forEach(c => {
        embed.addFields({ name: `${c.commandSuffix}`, value: `${c.commandDescription}\n \`${prefix}${c.commandSyntax}\` \n \n `, inline: false });
    });
    // channel.send(embed);
    channel.send({ embeds: [embed] });
}