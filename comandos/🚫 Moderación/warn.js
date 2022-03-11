const Discord = require('discord.js');
const {asegurar_todo} = require(`${process.cwd()}/handlers/funciones.js`)
const warnSchema = require(`${process.cwd()}/modelos/warns.js`)
module.exports = {
    name: "warn",
    aliases: ["warnear", "avisar"],
    desc: "Sirve para enviar un aviso a un usuario del Servidor",
    permisos: ["ADMINISTRATOR", "BAN_MEMBERS"],
    permisos_bot: ["ADMINISTRATOR", "BAN_MEMBERS"],
    run: async (client, message, args, prefix) => {
        //definimos la persona a avisar
        let usuario = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
        if (!usuario) return message.reply(`❌ **No se ha encontrado al usuario que has especificado!**`);
        await asegurar_todo(message.guild.id, usuario.id);
        //definimos razón, y si no hay, la razón será "No se ha especificado ninguna razón!"
        let razon = args.slice(1).join(" ");
        if(!razon) razon = "No se ha especificado ninguna razón!"

        //comprobamos que el usuario a avisar no es el dueño del servidor
        if(usuario.id == message.guild.ownerId) return message.reply(`❌ **No puedes avisar al DUEÑO del Servidor!**`);

        //comprobar que el BOT está por encima del usuario a avisar
        if (message.guild.me.roles.highest.position > usuario.roles.highest.position) {
            //comprobar que la posición del rol del usuario que ejecuta el comando sea mayor a la persona que vaya a avisar
            if (message.member.roles.highest.position > usuario.roles.highest.position) {
                //enviamos al usuario por privado que ha sido avisado!
                usuario.send({embeds: [
                    new Discord.MessageEmbed()
                    .setTitle(`Has sido avisado de __${message.guild.name}__`)
                    .setDescription(`**Razón:** \n\`\`\`yml\n${razon}\`\`\``)
                    .setColor(client.color)
                    .setTimestamp()
                ]}).catch(() => {message.reply(`No se le ha podido enviar el DM al usuario!`)});
                //enviamos en el canal que el usuario ha sido avisado exitosamenete

                message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(`✅ Usuario avisado`)
                .setDescription(`**Se ha avisado exitosamente a \`${usuario.user.tag}\` *(\`${usuario.id}\`)* del servidor!**`)
                .addField(`Razón`, `\n\`\`\`yml\n${razon}\`\`\``)
                .setColor(client.color)
                .setTimestamp()
                ]})
                //creamos el objeto del warn
                let objeto_warn = {
                    fecha: Date.now(),
                    autor: message.author.id,
                    razon
                }
                //empujamos el objeto en la base de datos
                await warnSchema.findOneAndUpdate({guildID: message.guild.id, userID: usuario.id}, {
                    $push: {
                        warnings: objeto_warn
                    }
                })
            } else {
                return message.reply(`❌ **Tu Rol está por __debajo__ del usuario que quieres avisar!**`)
            }
        } else {
            return message.reply(`❌ **Mi Rol está por __debajo__ del usuario que quieres avisar!**`)
        }


    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarollado por dewstouh#1088 || - ||    ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
