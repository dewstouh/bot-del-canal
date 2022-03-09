const ecoSchema = require(`${process.cwd()}/modelos/economia.js`);
const duration = require('humanize-duration');
var trabajos = [
    "Camionero",
    "Desarollador",
    "Mecánico",
    "Taxista"
];
module.exports = {
    name: "work",
    aliases: ["trabajar"],
    desc: "Sirve para trabajar y conseguir monedas cada 3h",
    run: async (client, message, args, prefix) => {
        //leemos la economia el usuario
        let data = await ecoSchema.findOne({userID: message.author.id});
        //definimos cada cuanto tiempo se puede ejecutar el comando EN MS
        let tiempo_ms = 3 * 60 * 60 * 1000 // 10800000 ms
        //definimos la recompensa aleatoria de dinero, que será un máximo de 1000 monedas y un mínimo de 200
        let recompensa = Math.floor(Math.random() * 800) + 200;
        //definimos el trabajo del usuario
        let trabajo = trabajos[Math.floor(Math.random() * trabajos.length)];
        //comprobaciones previas
        if(tiempo_ms - (Date.now() - data.work) > 0) {
            let tiempo_restante = duration(Date.now() - data.work - tiempo_ms,
            {
                language: "es",
                units: ["h", "m", "s"],
                round: true,
            })
            return message.reply(`🕑 **Tienes que esperar \`${tiempo_restante}\` para volver a reclamar tu recompensa diaria!**`)
        }
        await ecoSchema.findOneAndUpdate({userID: message.author.id}, {
            $inc: {
                dinero: recompensa
            },
            work: Date.now()
        })
        return message.reply(`✅ **Has trabajado como \`${trabajo}\` y has recibido una recompensa de \`${recompensa} monedas\`!**`)
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarollado por dewstouh#1088 || - ||    ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
