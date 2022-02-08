const Discord = require('discord.js');
const config = require('./config/config.json')
require('colors')
const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    ],
})

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

function requerirhandlers(){
    ["command", "events", "distube"].forEach(handler => {
        try {
            require(`./handlers/${handler}`)(client, Discord)
        } catch(e){
            console.warn(e)
        }
    })
}
requerirhandlers();

client.login(config.token)