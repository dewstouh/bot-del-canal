const Levels = require('discord-xp')
module.exports = {
    name: "nivel",
    aliases: ["level", "rank"],
    desc: "Sirve para ver tu nivel",
    run: async (client, message, args, prefix) => {
        const usuario = await Levels.fetch(message.author.id, message.guild.id);
        const xpSiguienteNivel = await Levels.xpFor(usuario.level+1);

        message.reply(`**Eres nivel \`${usuario.level}\`**\nNecesitas \`${xpSiguienteNivel - usuario.xp}xp  \` más para llegar al siguiente nivel`)
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarollado por dewstouh#1088 || - ||    ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
