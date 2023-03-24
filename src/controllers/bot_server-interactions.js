const { EmbedBuilder } = require("discord.js");
const spyService = require('../services/spy');
const whoisService = require('../services/whois');
const prefix = process.env.COMMAND_PREFIX;
const logs = require('./logs');


module.exports.repeatUserMessage = (message, channel) => {
    channel.send(`\`${message}\`>🦜`);
}

module.exports.sendMessage = async(channel, message) => {
    channel.send(message);
}

module.exports.sendBasicEmbed = (title, message, channel) => {
    const embed = new MessageEmbed();
    embed.setColor("#249cec");
    embed.setTitle(title);
    embed.setDescription(message);
    channel.send(embed);
}

module.exports.sendEmbed = (embed, channel) => {
    channel.send({ embeds: [embed] });
}

module.exports.sendDM = async(user, message) => {
    await user.send(message);
}

module.exports.sendEmbedWithHeader = (header, embed, channel) => {
    channel.send(header, embed);
}

module.exports.userIsBored = (author, channel) => {
    channel.send(`Il semblerait que ${author} soit blasé. 😒`);
}

module.exports.sendErrorMsg = async(channel, errorMsg) => {
    channel.send(errorMsg).then(msg => {
        setTimeout(() => msg.delete(), process.env.ERROR_MSG_DELETE_DELAY);
    });
}

module.exports.sendServerInformations = async(args, channel) => {
    inviteID = args.shift();
    if (inviteID.includes("/")) {
        inviteID = inviteID.split("/").pop();
    }
    try {
        await spyService.getInfosFromInviteLink(inviteID).then(response => {
            const embed = new EmbedBuilder().setTimestamp();
            let securityLevels = {
                0: "Aucune",
                1: "Faible",
                2: "Moyenne",
                3: "Élevée",
                4: "Maximum"
            }
            let nsfwLevels = {
                0: "Non renseigné",
                1: "NSFW",
                2: "SFW",
                3: "Age restreint"
            }
            embed.setColor("#249cec");
            embed.setTitle(`Informations sur l'invitation ${response.code}`).setURL(`https://discord.com/api/v10/invites/${response.code}`);
            embed.setThumbnail(`https://cdn.discordapp.com/icons/${response.guild.id}/${response.guild.icon}.png`);
            embed.addFields([{ name: `Nom du serveur`, value: `${response.guild.name} (ID: ${response.guild.id})` }]);
            if (response.guild.description != null) {
                embed.addFields([{ name: `Description`, value: response.guild.description }]);
            }
            if (response.guild.vanity_url_code != null) {
                embed.addFields([{ name: `invitation personnalisée`, value: response.guild.vanity_url_code, inline: true }]);
            }
            embed.addFields([{ name: `Protection du serveur`, value: securityLevels[response.guild.verification_level], inline: true },
                { name: `Type de contenu`, value: nsfwLevels[response.guild.nsfw_level], inline: true },
                { name: 'Url de l\'image', value: `https://cdn.discordapp.com/icons/${response.guild.id}/${response.guild.icon}.png`, inline: false }
            ]);
            if (response.guild.banner != null) {
                embed.addFields([{ name: 'Url de la bannière', value: `https://cdn.discordapp.com/banners/${response.guild.id}/${response.guild.banner}.png`, inline: true }]);
            }
            if (response.guild.splash != null) {
                embed.addFields([{ name: 'Url du splash', value: `https://cdn.discordapp.com/splashes/${response.guild.id}/${response.guild.splash}.png`, inline: true }]);
            }
            if (response.inviter) {
                embed.addFields([{ name: `Auteur de l'invitation`, value: `<@${response.inviter.id}>(${response.inviter.username}#${response.inviter.discriminator}) *(ID: ${response.inviter.id}*)`, inline: false }]);


            }
            channel.send({ embeds: [embed] });
        });
    } catch (error) {
        if (error.response.body && JSON.parse(error.response.body).code == 10006) {
            this.sendErrorMsg(channel, `l'invitation Discord ${inviteID} n'existe pas !`)
            throw new EvalErrorAA(`InvalidParam:${inviteID}`);
        } else if (error.response.body) {
            this.sendErrorMsg(channel, `L'API Discord est peut être cassée. Merci de retenter plus tard ou de vérifier la syntaxe de votre commande.`);
            throw new Error(`Param:${inviteID}, APIRESPONSE:${error.response.body}`);
        } else {
            this.sendErrorMsg(channel, `Une erreur inattendue est survenue. Merci de réessayer.`);
            throw new Error(`Param:${inviteID}, ${error.message}`);
        }
    }
}

module.exports.sendDataCenterInformations = async(author, channel, args) => {
    ip = args.shift();
    if (!ip) {
        throw new SyntaxError(`Format de la commande : \`${prefix}mondc [Adresse IP du Shadow]\``);
    }
    let datacenters = {
        "DFR1": "Gravelines",
        "FRDUN2": "Dunkerque",
        "FRSBG01": "Strasbourg",
        "DEFRA01": "Francfort",
        "TX1": "Dallas",
        "CAMTL01": "Montréal",
        "USWDC01": "Washginton DC",
        "USPOR01": "Portland"
    }
    ipInfos = await whoisService.getDataCenterByIp(ip);
    if (ipInfos.descr && ipInfos.descr.includes("Shadow")) {
        console.log(ipInfos.descr);
        console.log(datacenters[ipInfos.descr.split(' ')[2]]);
        channel.send(`${author}, le Datacenter de ton Shadow est à **${datacenters[ipInfos.descr.split(' ')[2]]}**.`);
    } else {
        this.sendErrorMsg(channel, `${author}, la commande doit se faire avec l'adresse IP de ton Shadow. Tu peux la récupérer en ouvrant ce lien dans ton Shadow : https://myv4.shadow.tech/`);
    }
}