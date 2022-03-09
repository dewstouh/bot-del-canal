const {paginacion} = require(`${process.cwd()}/handlers/funciones.js`);
const ecoSchema = require(`${process.cwd()}/modelos/economia.js`);
//definimos las medallas de los top 3 usuarios con más dinero
var medallas = {
    1: "🥇",
    2: "🥈",
    3: "🥉",
}

module.exports = {
    name: "leaderboard",
    aliases: ["lb", "top100", "top", "lb-economia", "ecolb", "top-eco"],
    desc: "Sirve para ver la latencia del Bot",
    run: async (client, message, args, prefix) => {
        const total = await ecoSchema.find();
        await message.guild.members.fetch();
        const ordenado = total.filter(member => message.guild.members.cache.get(member.userID)).sort((a, b) => Number((b.dinero+b.banco) - (a.dinero+a.banco)));
        const texto = ordenado.map((miembro, index) => `${medallas[index+1] ?? ""} \`${index+1}\` - <@${miembro.userID}> *\`${message.guild.members.cache.get(miembro.userID).user.tag}\`*\n**Dinero:** \`${miembro.dinero}\`\n**Banco:** \`${miembro.banco}\`\n\n`)
        paginacion(client, message, texto, "💸 LEADERBOARD DE ECONOMÍA 💸")
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarollado por dewstouh#1088 || - ||    ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
