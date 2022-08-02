const schema = require(`${process.cwd()}/modelos/servidor.js`);
const fs = require('fs');
module.exports = {
    name: "set-language",
    aliases: ["set-lang", "setlanguage", "change-lang", "changelanguage", "changelang", "lang", "language", "idioma", "cambiar-idioma"],
    desc: "Sirve para cambiar el Preijo del Bot en el Servidor",
    permisos: ["Administrator"],
    run: async (client, message, args, prefix, idioma) => {
        const data = await schema.findOne({guildID: message.guild.id});
        let idiomas = fs.readdirSync(`./idiomas`).filter(archivo => archivo.endsWith(".json")).map(archivo => archivo.replace(/.json/, ""));
        if(!args[0]) return message.reply(eval(client.la[idioma]["comandos"]["ajustes"]["set-language"]["variable1"]));
        if(!idiomas.includes(args[0])) return message.reply(eval(client.la[idioma]["comandos"]["ajustes"]["set-language"]["variable2"]));
        data.idioma = args[0];
        data.save();
        return message.reply(eval(client.la[idioma]["comandos"]["ajustes"]["set-language"]["variable3"]))
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarrollado por dewstouh#1088 || - ||   ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
