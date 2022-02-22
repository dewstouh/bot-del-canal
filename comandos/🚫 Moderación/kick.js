const Discord = require('discord.js')
module.exports = {
    name: "kick",
    aliases: ["kickear", "expulsar"],
    desc: "Sirve para expulsar a un usuario del Servidor",
    permisos: ["ADMINISTRATOR", "KICK_MEMBERS"],
    permisos_bot: ["ADMINISTRATOR", "KICK_MEMBERS"],
    run: async (client, message, args, prefix) => {
        //definimos la persona a banear
        let usuario = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
        if (!usuario) return message.reply(`❌ **No se ha encontrado al usuario que has especificado!**`);

        //definimos razón, y si no hay, la razón será "No se ha especificado ninguna razón!"
        let razon = args.slice(1).join(" ");
        if (!razon) razon = "No se ha especificado ninguna razón!"

        //comprobamos que el usuario a banear no es el dueño del servidor
        if (usuario.id == message.guild.ownerId) return message.reply(`❌ **No puedes expulsar al DUEÑO del Servidor!**`);

        //comprobar que el BOT está por encima del usuario a banear
        if (message.guild.me.roles.highest.position > usuario.roles.highest.position) {
            //comprobar que la posición del rol del usuario que ejecuta el comando sea mayor a la persona que vaya a banear
            if (message.member.roles.highest.position > usuario.roles.highest.position) {
                //enviamos al usuario por privado que ha sido baneado!
                usuario.send({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setTitle(`Has sido expulsado de __${message.guild.name}__`)
                            .setDescription(`**Razón:** \n\`\`\`yml\n${razon}\`\`\``)
                            .setColor(client.color)
                            .setTimestamp()
                    ]
                }).catch(() => { message.reply(`No se le ha podido enviar el DM al usuario!`) });
                //enviamos en el canal que el usuario ha sido baneado exitosamenete

                message.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setTitle(`✅ Usuario expulsado`)
                        .setDescription(`**Se ha expulsado exitosamente a \`${usuario.user.tag}\` *(\`${usuario.id}\`)* del servidor!**`)
                        .addField(`Razón`, `\n\`\`\`yml\n${razon}\`\`\``)
                        .setColor(client.color)
                        .setTimestamp()
                    ]
                })

                usuario.kick([razon]).catch(() => {
                    return message.reply({
                        embeds:
                            [new Discord.MessageEmbed()
                                .setTitle(`❌ No he podido banear al usuario!`)
                                .setColor("FF0000")
                            ]
                    })
                })
            } else {
                return message.reply(`❌ **Tu Rol está por __debajo__ del usuario que quieres banear!**`)
            }
        } else {
            return message.reply(`❌ **Mi Rol está por __debajo__ del usuario que quieres banear!**`)
        }


    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarollado por dewstouh#1088 || - ||    ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
