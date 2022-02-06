const schema = require(`${process.cwd()}/modelos/servidor.js`)
module.exports = {
    name: "prefix",
    aliases: ["prefijo", "cambiarprefijo", "cambiarprefix"],
    desc: "Sirve para cambiar el Preijo del Bot en el Servidor",
    run: async (client, message, args, prefix) => {
        if(!args[0]) return message.reply(`❌ Tienes que especificar el prefijo nuevo para el Bot!`)
        await schema.findOneAndUpdate({guildID: message.guild.id}, {
            prefijo: args[0]
        })
        return message.reply(`✅ Cambiado el Prefijo de \`${prefix}\` a \`${args[0]}\``)
    }
}