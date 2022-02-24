const { asegurar_todo } = require("./funciones");
const setupSchema = require(`${process.cwd()}/modelos/setups`);
const ticketSchema = require(`${process.cwd()}/modelos/tickets`);
const Discord = require('discord.js');
const html = require('discord-html-transcripts')

module.exports = client => {

    //CREACIÓN DE TICKETS
    client.on("interactionCreate", async interaction => {
        try {

            //comprobaciones previas
            if (!interaction.guild || !interaction.channel || !interaction.isButton() || interaction.message.author.id !== client.user.id || interaction.customId !== "crear_ticket") return;
            //aseguramos la base de datos para evitar errores
            await asegurar_todo(interaction.guild.id);
            //buscamos el setup en la base de datos
            const setup = await setupSchema.findOne({ guildID: interaction.guild.id });
            //comprobaciones previas
            if (!setup || !setup.sistema_tickets || !setup.sistema_tickets.canal || interaction.channelId !== setup.sistema_tickets.canal || interaction.message.id !== setup.sistema_tickets.mensaje) return;
            //buscamos primero si el usuario tiene un ticket creado
            let ticket_data = await ticketSchema.find({ guildID: interaction.guild.id, autor: interaction.user.id, cerrado: false });

            //comprobar si el usuario ya tiene un ticket creado en el servidor y NO esté cerrado, y si es así, hacemos return;
            for (const ticket of ticket_data) {
                if (interaction.guild.channels.cache.get(ticket.canal)) return interaction.reply({ content: `❌ **Ya tienes un ticket creado en <#${ticket.canal}>**`, ephemeral: true });
            }

            await interaction.reply({ content: "⌛ **Creando tu ticket... Porfavor espere**", ephemeral: true });
            //creamos el canal
            const channel = await interaction.guild.channels.create(`ticket-${interaction.member.user.username}`.substring(0, 50), {
                type: "GUILD_TEXT",
                parent: interaction.channel.parent ?? null,
                permissionOverwrites: [
                    //denegamos el permiso de ver el ticket a otra persona que no sea el creador del ticket
                    {
                        id: interaction.guild.id,
                        deny: ["VIEW_CHANNEL"]
                    },
                    //permitimos ver el ticket al usuario que ha creado el ticket
                    {
                        id: interaction.user.id,
                        allow: ["VIEW_CHANNEL"]
                    },
                    //ROL ESPECIAL PARA QUE PUEDA VER LOS TICKETS
                    /*
                    {
                        id: "943494866070044722",
                        allow: ["VIEW_CHANNEL"]
                    },
                    */
                ]
            });
            //enviamos la bienvenida en el ticket del usuario
            channel.send({
                embeds: [new Discord.MessageEmbed()
                    .setTitle(`Ticket de ${interaction.member.user.tag}`)
                    .setDescription(`Bienvenido al soporte ${interaction.member}\nExplica detallademente tu problema.`)
                    .setColor(client.color)
                ],
                components: [new Discord.MessageActionRow().addComponents(
                    [
                        new Discord.MessageButton().setStyle("DANGER").setLabel("CERRAR").setEmoji("🔒").setCustomId("cerrar_ticket"),
                        new Discord.MessageButton().setStyle("SECONDARY").setLabel("BORRAR").setEmoji("🗑").setCustomId("borrar_ticket"),
                        new Discord.MessageButton().setStyle("PRIMARY").setLabel("GUARDAR").setEmoji("💾").setCustomId("guardar_ticket"),
                    ]
                )]
            });
            //guardamos el ticket en la base de datos
            let data = new ticketSchema({
                guildID: interaction.guild.id,
                autor: interaction.user.id,
                canal: channel.id,
                cerrado: false,
            });
            data.save();
            await interaction.editReply({ content: `✅ **Ticket creado en ${channel}**`, ephemeral: true })

        } catch (e) {
            console.log(e)
        }
    })

    //BOTONES
    client.on("interactionCreate", async interaction => {
        try {

            //comprobaciones previas
            if (!interaction.guild || !interaction.channel || !interaction.isButton() || interaction.message.author.id !== client.user.id) return;
            //aseguramos la base de datos para evitar errores
            await asegurar_todo(interaction.guild.id);

            let ticket_data = await ticketSchema.findOne({ guildID: interaction.guild.id, canal: interaction.channel.id})
            switch (interaction.customId) {
                case "cerrar_ticket":{
                    //si el ticket ya está cerrado, hacemos return;
                    if(ticket_data && ticket_data.cerrado) return interaction.reply({content: `❌ **Este ticket ya estaba cerrado!**`, ephemeral: true});
                    interaction.deferUpdate();
                    //creamos el mensaje de verificar
                    const verificar = await interaction.channel.send({
                        embeds: [new Discord.MessageEmbed()
                        .setTitle(`Verificate primero!`)
                        .setColor("GREEN")
                        ],
                        components: [new Discord.MessageActionRow().addComponents(
                            new Discord.MessageButton().setLabel("Verificarse").setStyle("SUCCESS").setCustomId("verificar").setEmoji("✅")
                        )]
                    });

                    //creamos el collector
                    const collector = verificar.createMessageComponentCollector({
                        filter: i => i.isButton() && i.message.author.id == client.user.id && i.user,
                        time: 180e3
                    });

                    //escuchamos clicks en el botón
                    collector.on("collect", boton => {
                        //si la persona que hace clic en el botón de verificarse NO es la misma persona que ha hecho clic al botón de cerrar ticket, return;
                        if(boton.user.id !== interaction.user.id) return boton.reply({content: `❌ **No puedes hacer eso! Solo ${interaction.user} puede!**`, ephemeral: true});

                        //paramos el collector
                        collector.stop();
                        boton.deferUpdate();
                        //cerramos el ticket en la base de datos
                        ticket_data.cerrado = true;
                        ticket_data.save();
                        //hacemos que el usuario que ha creado el ticket, no pueda ver el ticket
                        interaction.channel.permissionOverwrites.edit(ticket_data.autor, { VIEW_CHANNEL: false });
                        interaction.channel.send(`✅ **Ticket Cerrado por \`${interaction.user.tag}\` el <t:${Math.round(Date.now() / 1000)}>**`)
                    });

                    collector.on("end", (collected) => {
                        //si el usuario ha hecho clic al botón de verificar, editamos el mensaje desactivado el botón de verificar
                        if(collected && collected.first() && collected.first().customId){
                            //editamos el mensaje desactivado el botón de verificarse
                            verificar.edit({
                                components: [new Discord.MessageActionRow().addComponents(
                                    new Discord.MessageButton().setLabel("Verificarse").setStyle("SUCCESS").setCustomId("verificar").setEmoji("✅").setDisabled(true)
                                )]
                            })
                        } else {
                            verificar.edit({
                                embeds: [verificar.embeds[0].setColor("RED")],
                                components: [new Discord.MessageActionRow().addComponents(
                                    new Discord.MessageButton().setLabel("NO VERIFICADO").setStyle("DANGER").setCustomId("verificar").setEmoji("❌").setDisabled(true)
                                )]
                            })
                        }
                    })

                }
                    break;

                case "borrar_ticket": {
                    interaction.deferUpdate();
                    //creamos el mensaje de verificar
                    const verificar = await interaction.channel.send({
                        embeds: [new Discord.MessageEmbed()
                        .setTitle(`Verificate primero!`)
                        .setColor("GREEN")
                        ],
                        components: [new Discord.MessageActionRow().addComponents(
                            new Discord.MessageButton().setLabel("Verificarse").setStyle("SUCCESS").setCustomId("verificar").setEmoji("✅")
                        )]
                    });

                    //creamos el collector
                    const collector = verificar.createMessageComponentCollector({
                        filter: i => i.isButton() && i.message.author.id == client.user.id && i.user,
                        time: 180e3
                    });

                    //escuchamos clicks en el botón
                    collector.on("collect", boton => {
                        //si la persona que hace clic en el botón de verificarse NO es la misma persona que ha hecho clic al botón de cerrar ticket, return;
                        if(boton.user.id !== interaction.user.id) return boton.reply({content: `❌ **No puedes hacer eso! Solo ${interaction.user} puede!**`, ephemeral: true});

                        //paramos el collector
                        collector.stop();
                        boton.deferUpdate();
                        //borramos el ticket de la base de datos
                        ticket_data.delete();
                        interaction.channel.send(`✅ **El ticket será eliminado en menos de \`3 segundos ...\`\nAcción por: \`${interaction.user.tag}\` el <t:${Math.round(Date.now() / 1000)}>**`)
                        //borramos el canal en 3 segundos
                        setTimeout(() => {
                            interaction.channel.delete();
                        }, 3_000);
                    });

                    collector.on("end", (collected) => {
                        //si el usuario ha hecho clic al botón de verificar, editamos el mensaje desactivado el botón de verificar
                        if(collected && collected.first() && collected.first().customId){
                            //editamos el mensaje desactivado el botón de verificarse
                            verificar.edit({
                                components: [new Discord.MessageActionRow().addComponents(
                                    new Discord.MessageButton().setLabel("Verificarse").setStyle("SUCCESS").setCustomId("verificar").setEmoji("✅").setDisabled(true)
                                )]
                            })
                        } else {
                            verificar.edit({
                                embeds: [verificar.embeds[0].setColor("RED")],
                                components: [new Discord.MessageActionRow().addComponents(
                                    new Discord.MessageButton().setLabel("NO VERIFICADO").setStyle("DANGER").setCustomId("verificar").setEmoji("❌").setDisabled(true)
                                )]
                            })
                        }
                    })

                }
                break;

                case "guardar_ticket": {
                    interaction.deferUpdate();
                    //enviamos el mensaje de guardando ticket
                    const mensaje = await interaction.channel.send({
                        content: interaction.user.toString(),
                        embeds: [new Discord.MessageEmbed()
                        .setTitle(`⌛ Guardando Ticket...`)
                        .setColor(client.color)
                        ]
                    });

                    //generamos el archivo html con la conversación
                    const adjunto = await html.createTranscript(interaction.channel, {
                        limit: -1,
                        returnBuffer: false,
                        fileName: `${interaction.channel.name}.html`
                    })

                    mensaje.edit({
                        embeds: [new Discord.MessageEmbed()
                            .setTitle(`✅ Ticket Gurdado`)
                            .setColor("GREEN")
                        ],
                        files: [adjunto]
                    })                    
                }
                break;
            
                default:
                    break;
            }

        } catch (e) {
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
