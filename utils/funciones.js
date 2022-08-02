const serverSchema = require(`${process.cwd()}/modelos/servidor.js`);
const setupSchema = require(`${process.cwd()}/modelos/setups.js`);
const warnSchema = require(`${process.cwd()}/modelos/warns.js`);
const ecoSchema = require(`${process.cwd()}/modelos/economia.js`);
const config = require(`${process.cwd()}/config/config.json`);
const Discord = require('discord.js')

module.exports = {
    asegurar_todo,
    paginacion
}

async function asegurar_todo(guildid, userid) {
    if (guildid) {
        let serverdata = await serverSchema.findOne({ guildID: guildid })
        if (!serverdata) {
            console.log(`Asegurado: Config de Server`.green);
            serverdata = await new serverSchema({
                guildID: guildid,
                prefijo: config.prefix
            });
            await serverdata.save();
        }
        let setupsdata = await setupSchema.findOne({ guildID: guildid })
        if (!setupsdata) {
            console.log(`Asegurado: Setups`.green);
            setupsdata = await new setupSchema({
                guildID: guildid,
                reaccion_roles: [],
            });
            await setupsdata.save();
        }
    }
    if (userid) {
        let ecodata = await ecoSchema.findOne({ userID: userid })
        if (!ecodata) {
            console.log(`Asegurado: Economia de ${userid}`.green);
            ecodata = await new ecoSchema({
                userID: userid
            });
            await ecodata.save();
        }
    }
    if(guildid && userid){
        let warn_data = await warnSchema.findOne({ guildID: guildid, userID: userid })
        if (!warn_data) {
            console.log(`Asegurado: Warnings de ${userid} en ${guildid}`.green);
            warn_data = await new warnSchema({
                guildID: guildid,
                userID: userid,
                warnings: [],
            });
            await warn_data.save();
        }
    }
}


//definimos la funcion de paginación
async function paginacion(client, message, texto, titulo = "Paginación", elementos_por_pagina = 5) {

    /* DIVIDIMOS EL TEXTO PARA CREAR LAS PAGINAS Y EMPUJARLO EN LOS EMBEDS */

    var embeds = [];
    var dividido = elementos_por_pagina;
    for(let i = 0; i < texto.length; i+= dividido) {
        let desc = texto.slice(i, elementos_por_pagina);
        elementos_por_pagina+= dividido;
        //creamos un embed por cada pagina de los datos divididos
        let embed = new Discord.EmbedBuilder()
        .setTitle(titulo.toString())
        .setDescription(desc.join(" "))
        .setColor(client.color)
        .setThumbnail(message.guild.iconURL({dynamic: true}))
        embeds.push(embed)
    }

    let paginaActual = 0;
    //Si la cantidad de embeds es solo 1, envíamos el mensaje tal cual sin botones
    if (embeds.length === 1) return message.channel.send({ embeds: [embeds[0]] }).catch(() => { });
    //Si el numero de embeds es mayor 1, hacemos el resto || definimos los botones.
    let boton_atras = new Discord.ButtonBuilder().setStyle('Success').setCustomId('Atrás').setEmoji('929001012176507040').setLabel('Atrás')
    let boton_inicio = new Discord.ButtonBuilder().setStyle('Danger').setCustomId('Inicio').setEmoji('🏠').setLabel('Inicio')
    let boton_avanzar = new Discord.ButtonBuilder().setStyle('Success').setCustomId('Avanzar').setEmoji('929001012461707335').setLabel('Avanzar')
    //Enviamos el mensaje embed con los botones
    let embedpaginas = await message.channel.send({
        content: `**Haz click en los __Botones__ para cambiar de páginas**`,
        embeds: [embeds[0].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })],
        components: [new Discord.ActionRowBuilder().addComponents([boton_atras, boton_inicio, boton_avanzar])]
    });
    //Creamos un collector y filtramos que la persona que haga click al botón, sea la misma que ha puesto el comando, y que el autor del mensaje de las páginas, sea el cliente
    const collector = embedpaginas.createMessageComponentCollector({ filter: i => i?.isButton() && i?.user && i?.user.id == message.author.id && i?.message.author.id == client.user.id, time: 180e3 });
    //Escuchamos los eventos del collector
    collector.on("collect", async b => {
        //Si el usuario que hace clic a el botón no es el mismo que ha escrito el comando, le respondemos que solo la persona que ha escrito >>queue puede cambiar de páginas
        if (b?.user.id !== message.author.id) return b?.reply({ content: `❌ **Solo la persona que ha escrito \`${prefix}queue\` puede cambiar de páginas!` });

        switch (b?.customId) {
            case "Atrás": {
                //Resetemamos el tiempo del collector
                collector.resetTimer();
                //Si la pagina a retroceder no es igual a la primera pagina entonces retrocedemos
                if (paginaActual !== 0) {
                    //Resetemamos el valor de pagina actual -1
                    paginaActual -= 1
                    //Editamos el embeds
                    await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                    await b?.deferUpdate();
                } else {
                    //Reseteamos al cantidad de embeds - 1
                    paginaActual = embeds.length - 1
                    //Editamos el embeds
                    await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                    await b?.deferUpdate();
                }
            }
                break;

            case "Inicio": {
                //Resetemamos el tiempo del collector
                collector.resetTimer();
                //Si la pagina a retroceder no es igual a la primera pagina entonces retrocedemos
                paginaActual = 0;
                await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                await b?.deferUpdate();
            }
                break;

            case "Avanzar": {
                //Resetemamos el tiempo del collector
                collector.resetTimer();
                //Si la pagina a avanzar no es la ultima, entonces avanzamos una página
                if (paginaActual < embeds.length - 1) {
                    //Aumentamos el valor de pagina actual +1
                    paginaActual++
                    //Editamos el embeds
                    await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                    await b?.deferUpdate();
                    //En caso de que sea la ultima, volvemos a la primera
                } else {
                    //Reseteamos al cantidad de embeds - 1
                    paginaActual = 0
                    //Editamos el embeds
                    await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                    await b?.deferUpdate();
                }
            }
                break;

            default:
                break;
        }
    });
    collector.on("end", () => {
        //desactivamos los botones y editamos el mensaje
        embedpaginas.components[0].components.map(boton => boton.disabled = true)
        embedpaginas.edit({ content: `El tiempo ha expirado!`, embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
    });
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarrollado por dewstouh#1088 || - ||   ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
