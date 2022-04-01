const setupSchema = require(`${process.cwd()}/modelos/setups.js`);
const {mongodb} = require(`${process.cwd()}/config/config.json`);
const Levels = require('discord-xp');
Levels.setURL(mongodb);
module.exports = client => {
    client.on("messageCreate", async message => {
        try {
            //comprobaciones previas
            if(!message.guild || !message.channel || message.author.bot) return;
            const setupData = await setupSchema.findOneAndUpdate({guildID: message.guild.id});

            //comprobaciones previas
            if(!setupData || !setupData.niveles || !message.guild.channels.cache.get(setupData.niveles.canal)) return;

            let xpRandom = Math.floor(Math.random() * 30) + 1;
            let subeNivel = await Levels.appendXp(message.author.id, message.guild.id, xpRandom);
            let usuario = await Levels.fetch(message.author.id, message.guild.id);

            let canalNotificaciones = message.guild.channels.cache.get(setupData.niveles.canal);
            let mensajeSubirNivel = setupData.niveles.mensaje.replace(/{usuario}/, message.author).replace(/{nivel}/, usuario.level);
            
            if(subeNivel && canalNotificaciones && mensajeSubirNivel) {
                canalNotificaciones.send(mensajeSubirNivel);
            }

        } catch(e){
            console.log(e)
        }
    })
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarollado por dewstouh#1088 || - ||    ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
