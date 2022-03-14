const Discord = require('discord.js');
const setupSchema = require(`${process.cwd()}/modelos/setups.js`);

module.exports = {
    name: "setup-suggestion",
    aliases: ["suggestion-setup", "setup-sugerencias", "setup-sugerencia", "setupsugerencias"],
    desc: "Sirve para crear un sistema de Sugerencias",
    permisos: ["ADMINISTRATOR"],
    permisos_bot: ["MANAGE_ROLES", "MANAGE_CHANNELS"],
    run: async (client, message, args, prefix) => {
        if(!args.length) return message.reply("❌ **Tienes que especificar el canal de sugerencias!**")
        const channel = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first();
        if(!channel || channel.type !== "GUILD_TEXT") return message.reply("❌ **El canal de sugerencias que has mencionado no existe!**");
        await setupSchema.findOneAndUpdate({guildID: message.guild.id}, {
            sugerencias: channel.id
        })
        return message.reply({
            embeds: [new Discord.MessageEmbed()
            .setTitle(`✅ Establecido el canal de sugerencias a \`${channel.name}\``)
            .setDescription(`*Cada vez que una persona envíe un mensaje en ${channel}, lo convertiré a sugerencia!*`)
            .setColor(client.color)
            ]
        })
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarollado por dewstouh#1088 || - ||    ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
