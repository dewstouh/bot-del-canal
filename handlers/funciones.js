const serverSchema = require(`${process.cwd()}/modelos/servidor.js`);
const setupSchema = require(`${process.cwd()}/modelos/setups.js`);
const config = require(`${process.cwd()}/config/config.json`);

module.exports = {
    asegurar_todo,
}

async function asegurar_todo(guildid){
    let serverdata = await serverSchema.findOne({guildID: guildid})
    if(!serverdata){
        console.log(`Asegurado: Config de Server`.green);
        serverdata = await new serverSchema({
            guildID: guildid,
            prefijo: config.prefix
        });
        await serverdata.save();
    }
    let setupsdata = await setupSchema.findOne({guildID: guildid})
    if(!setupsdata){
        console.log(`Asegurado: Setups`.green);
        setupsdata = await new setupSchema({
            guildID: guildid,
            reaccion_roles: [],
        });
        await setupsdata.save();
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarollado por dewstouh#1088 || - ||    ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
