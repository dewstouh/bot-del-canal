const Discord = require('discord.js');
const setupSchema = require(`${process.cwd()}/modelos/setups.js`);
module.exports = {
    name: "setup-rank",
    aliases: ["setup-ranking", "setup-ranks", "setup-niveles", "setup-nivel", "setup-level", "setup-levels"],
    desc: "Sirve para crear un sistema de niveles",
    permisos: ["ADMINISTRATOR"],
    run: async (client, message, args, prefix) => {
        const canalNotificaciones = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first();
        if(!canalNotificaciones) return message.reply("❌ **No has especificado un canal de notificaciones al subir de nivel!**");

        const mensaje = args.slice(1).join(" ").substring(0, 2048);
        if(!mensaje) return message.reply("❌ **No has especificado un mensaje cuando un usuario sube de nivel!**");

        await setupSchema.findOneAndUpdate({guildID: message.guild.id}, {
            niveles: {
                canal: canalNotificaciones.id,
                mensaje
            }
        })

        return message.reply({embeds: [
            new Discord.MessageEmbed().setTitle(`✅ Sistema de Niveles activado!`)
            .setDescription(`*Enviaré las notificaciones cuando un usuario suba de nivel en ${canalNotificaciones}*`)
            .setColor("GREEN")
        ]})
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarollado por dewstouh#1088 || - ||    ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
