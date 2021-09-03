const prefix = process.env.COMMAND_PREFIX;

module.exports.commandList = (channel) => {
    channel.send(`Pour afficher la liste des commandes écrivez \`${prefix}commands\``);

}