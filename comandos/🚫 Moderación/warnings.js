const {paginacion} = require(`${process.cwd()}/handlers/funciones.js`);
const warnSchema = require(`${process.cwd()}/modelos/warns.js`);
const {asegurar_todo} = require(`${process.cwd()}/handlers/funciones.js`)
module.exports = {
    name: "warnings",
    aliases: ["avisos", "user-warns", "warnings-usuario", "warns"],
    desc: "Sirve para mostrar los warnings de un Usuario",
    run: async (client, message, args, prefix) => {
        const usuario = message.guild.members.cache.get(args[0]) || message.mentions.members.first() || message.member;
        await asegurar_todo(message.guild.id, usuario.id)
        let data = await warnSchema.findOne({guildID: message.guild.id, userID: usuario.id});
        if(data.warnings.length == 0) return message.reply(`✅ **\`${usuario.user.tag}\` no tiene ningún warning en el servidor!**`);
        const texto = data.warnings.map((warn, index) => `================================\n**ID DE WARN:** \`${index}\`\n**FECHA:** <t:${Math.round(warn.fecha / 1000)}>\n**AUTOR:** <@${warn.autor}> *\`${message.guild.members.cache.get(warn.autor).user.tag}\`*\n**RAZÓN:** \`${warn.razon}\`\n`)
        paginacion(client, message, texto, `🛠 \`[${data.warnings.length}]\` WARNINGS DE ${usuario.user.tag}`, 1)
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarollado por dewstouh#1088 || - ||    ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
