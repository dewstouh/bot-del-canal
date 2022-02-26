const ms = require('ms')
const Discord = require('discord.js')
const keySchema = require(`${process.cwd()}/modelos/clave.js`);
module.exports = {
    name: "keygen",
    aliases: ["generar-clave", "generarclave"],
    desc: "Sirve para generar una Clave Premium para un servidor",
    owner: true,
    run: async (client, message, args, prefix) => {
        if(!args.length) return message.reply(`❌ **Tienes que especificar un la duración Premium de la clave Clave!**\n**Ejemplo:** \`30d\``);
        const tiempo = ms(args[0]) //pasar el tiempo que ha especificado el usuario a milisegundos
        if(tiempo) {
            let clave = generar_clave();
            message.author.send({
                embeds: [new Discord.MessageEmbed()
                .setTitle(`🔑 Nueva Clave!`)
                .setDescription("```"+clave+"```")
                .addField(`Generada por`, `\`${message.author.tag}\` \`${message.author.id}\``)
                .addField(`Suscripción`, `\`${args[0]}\``)
                .addField(`Estado`, `\`SIN USAR\``)
                .setColor(client.color)
                ]
            }).catch(() => {
                message.react("❌")
                return message.reply("❌ **No te he podido enviar el DM de los detalles de la clave!\nClave eliminada!**")
            });
            let data = new keySchema({
                clave,
                duracion: tiempo,
                activado: false,
            });
            data.save();
            message.react("✅")
            return message.reply("✅ **Nueva Clave Generada en la Base de Datos**\n*Se ha enviado la información de la clave en tus DMs!*")
        } else {
            return message.reply("❌ **El tiempo de duración Premium que has especificado no es válido!**")
        }
    }
}

function generar_clave(){
    //CLAVE: XXXX-XXXX-XXXX-XXXX
    let posiblidades = "ABCDEFGHIJLKMNOPQRSTUVWXYZ0123456789";
    let parte1 = "";
    let parte2 = "";
    let parte3 = "";
    let parte4 = "";
    for(let i = 0; i < 4; i++){
        parte1 += posiblidades.charAt(Math.floor(Math.random() * posiblidades.length));
        parte2 += posiblidades.charAt(Math.floor(Math.random() * posiblidades.length));
        parte3 += posiblidades.charAt(Math.floor(Math.random() * posiblidades.length));
        parte4 += posiblidades.charAt(Math.floor(Math.random() * posiblidades.length));
    }
    //devolvemos la clave generada, por ej: ABJS-X252-GASH-6T1S
    return `${parte1}-${parte2}-${parte3}-${parte4}`
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarollado por dewstouh#1088 || - ||    ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
