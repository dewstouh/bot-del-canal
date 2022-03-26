const { GiveawaysManager } = require('discord-giveaways');
const sorteosSchema = require(`${process.cwd()}/modelos/sorteos.js`);

module.exports = async client => {
    //obtenemos la base de los sorteos pero si no existe la creamos.
    let db = await sorteosSchema.findOne({ ID: "sorteos" });
    if (!db || db == null) {
        db = await new sorteosSchema();
        await db.save();
    }

    //creamos nuestro propio constructor de sistemas de sorteos usando mongoDB
    const SorteosConMongoDB = class SorteosMongoDB extends GiveawaysManager {

        async getAllGiveaways() {
            //obtenemos la base de los sorteos y devolvemos el array de los datos del sorteo haciendo return;
            let db = await sorteosSchema.findOne({ ID: "sorteos" });
            return db.data;
        }

        async saveGiveaway(messageID, datoSorteo) {
            //empujamos el sorteo en el array de sorteos
            await sorteosSchema.findOneAndUpdate({ ID: "sorteos" }, {
                $push: {
                    data: datoSorteo
                }
            });
            return true;
        }

        async editGiveaway(messageID, datoSorteo) {
            //obtenemos la db de los sorteos
            let db = await sorteosSchema.findOne({ ID: "sorteos" });
            let sorteos = db.data;

            let sorteoIndex = -1;
            //buscamos el index del sorteo haciendo un mapeado de los sorteos y filtrando
            sorteos.map((sorteo, index) => {
                if (sorteo.messageId.includes(messageID)) return sorteoIndex = index;
            })
            console.log(sorteoIndex);
            //si el index es > -1, significa que se ha encontrado el sorteo
            if (sorteoIndex > -1) {
                db.data[sorteoIndex] = datoSorteo;
                await sorteosSchema.findOneAndUpdate({ ID: "sorteos" }, db)
                return true;
            }
        }

        async deleteGiveaway(messageID) {
            //ovtenemos la db de los sorteos
            let db = await sorteosSchema.findOne({ ID: "sorteos" });
            let sorteos = db.data;
            let sorteoIndex = -1;
            //buscamos el index del sorteo haciendo un mapeado de los sorteos y filtrando
            sorteos.map((sorteo, index) => {
                if (sorteo.messageId.includes(messageID)) return sorteoIndex = index;
            })
            //si el index es > -1, significa que se ha encontrado el sorteo
            if (sorteoIndex > -1) {
                db.data.splice(sorteoIndex, 1)
                await sorteosSchema.findOneAndUpdate({ ID: "sorteos" }, db)
                return true;
            }
        }
    }

    //crear sistema de sorteos
    client.giveawaysManager = new SorteosConMongoDB(client, {
        default: {
            botsCanWin: false,
            embedColor: client.color,
            embedColorEnd: "#000000",
            reaction: "🎉"
        }
    })
}
