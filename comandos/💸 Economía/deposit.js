const ecoSchema = require(`${process.cwd()}/modelos/economia.js`);
module.exports = {
    name: "deposit",
    aliases: ["depositar", "dep"],
    desc: "Sirve para depositar dinero en el banco",
    run: async (client, message, args, prefix) => {
        //leemos la economia el usuario
        let data = await ecoSchema.findOne({userID: message.author.id});
        let cantidad = args[0];
        //comprobaciones previas
        if(["todo", "all-in", "all"].includes(args[0])) {
            cantidad = data.dinero
        } else {
            if(isNaN(cantidad) || cantidad <= 0 || cantidad % 1 != 0) return message.reply("❌ **No has especificado una cantidad válida para depositar!**");
            if(cantidad > data.dinero) return message.reply("❌ **No tienes tanto dinero para depositar!**");
        }
       await ecoSchema.findOneAndUpdate({userID: message.author.id}, {
           $inc: {
               dinero: -cantidad,
               banco: cantidad
           }
       });
       return message.reply(`✅ **Has depositado \`${cantidad} monedas\` en tu banco!**`);
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarollado por dewstouh#1088 || - ||    ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
