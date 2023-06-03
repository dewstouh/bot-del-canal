const Discord = require('discord.js');
const setupSchema = require(`${process.cwd()}/modelos/setups.js`);

module.exports = {
    name: "setup-suggestion",
    aliases: ["suggestion-setup", "setup-sugerencias", "setup-sugerencia", "setupsugerencias"],
    desc: "Sirve para crear un sistema de Sugerencias",
    permisos: ["Administrator"],
    permisos_bot: ["ManageRoles", "ManageChannels"],
    run: async (client, message, args, prefix) => {
        if(!args.length) return message.reply("❌ **Tienes que especificar el canal de sugerencias!**")
        const channel = message.guild.channels.cache.get(args[0]) || message.mentions.channels.filter(c => c.guild.id == message.guild.id).first()
        if(!channel || channel.type !== 0) return message.reply("❌ **El canal de sugerencias que has mencionado no existe!**");
        await setupSchema.findOneAndUpdate({guildID: message.guild.id}, {
            sugerencias: channel.id
        })
        return message.reply({
            embeds: [new Discord.EmbedBuilder()
            .setTitle(`✅ Establecido el canal de sugerencias a \`${channel.name}\``)
            .setDescription(`*Cada vez que una persona envíe un mensaje en ${channel}, lo convertiré a sugerencia!*`)
            .setColor(client.color)
            ]
        })
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarrollado por dewstouh#1088 || - ||   ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
