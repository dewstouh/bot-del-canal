const Levels = require('discord-xp');
const setupSchema = require(`${process.cwd()}/modelos/setups.js`);
module.exports = {
    name: "nivel",
    aliases: ["level", "rank"],
    desc: "Sirve para ver tu nivel",
    run: async (client, message, args, prefix) => {
        let setupData = await setupSchema.findOne({guildID: message.guild.id});
        if(!setupData.niveles || !setupData.niveles.mensaje || !message.guild.channels.cache.get(setupData.niveles.canal)) return message.reply("❌ **No está activado el sistema de niveles en este servidor!**");
        const usuario = await Levels.fetch(message.author.id, message.guild.id);
        const xpSiguienteNivel = await Levels.xpFor(usuario.level+1);

        message.reply(`**Eres nivel \`${usuario.level}\`**\nNecesitas \`${xpSiguienteNivel - usuario.xp}xp\` más para llegar al siguiente nivel!`)
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarrollado por dewstouh#1088 || - ||   ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
