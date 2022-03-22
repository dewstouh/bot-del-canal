const schema = require(`${process.cwd()}/modelos/servidor.js`)
module.exports = {
    name: "prefix",
    aliases: ["prefijo", "cambiarprefijo", "cambiarprefix"],
    desc: "Sirve para cambiar el Preijo del Bot en el Servidor",
    run: async (client, message, args, prefix, idioma) => {
        if(!args[0]) return message.reply(client.la[idioma]["comandos"]["ajustes"]["prefix"]["variable1"])
        await schema.findOneAndUpdate({guildID: message.guild.id}, {
            prefijo: args[0]
        })
        return message.reply(eval(client.la[idioma]["comandos"]["ajustes"]["prefix"]["variable1"]))
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarollado por dewstouh#1088 || - ||    ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
