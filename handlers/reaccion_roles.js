const setupSchema = require(`${process.cwd()}/modelos/setups.js`)
const { asegurar_todo } = require(`${process.cwd()}/handlers/funciones.js`)

module.exports = client => {
    //AÑADIR ROLES AL AÑADIR LA REACCIÓN
    client.on("messageReactionAdd", async (reaction, user) => {
        try {
            //Comprobaciones previas (Si el usuario que añade la reacción es un bot o no hay server return)
            if (user.bot || !reaction.message.guild) return;
            //Comprobaciones previas (Si la reacción es parcial, la guardamos)
            if (reaction.partial) await reaction.fetch().catch(() => { });
            //Comprobaciones previas (Si la el mensaje de la reacción es parcial, la guardamos)
            if (reaction.message && reaction.message.partial) await reaction.message.fetch();
            //Aseguramos la base de datos en caso de que no haya una
            await asegurar_todo(reaction.message.guild.id);
            //Cargamos la base de datos
            const setup = await setupSchema.findOne({ guildID: reaction.message.guild.id });
            const reaccionroles = setup.reaccion_roles;
            //Comprobaciones previas (Si no hay un setup de reacciones, return)
            if (!reaccionroles || !reaccionroles.length || reaccionroles.length === 0 || reaccionroles === undefined || reaccionroles === null) return;
            //Hacemos un bucle entre todas las configuraciones de las reacciones
            for (let i = 0; i < reaccionroles.length; i++) {
                //Si la id del mensaje de la reacción coincide con una de la base de datos, continuamos
                if (reaction.message.id === reaccionroles[i].ID_MENSAJE) {
                    let usuario = await reaction.message.guild.members.cache.get(user.id);
                    let parametros = reaccionroles[i].Parametros;
                    let rol;
                    //Hacemos un bucle en los parámetros de la configuración de la reacción con roles encontrada
                    for (let k = 0; k < parametros.length; k++) {
                        //Si el emoji reaccionado tiene ID, significa que es personalizado (del servidor)
                        if (reaction.emoji?.id == parametros[k].Emoji) {
                            try {
                                rol = parametros[k].Rol;
                                let role = reaction.message.guild.roles.cache.get(parametros[k].Rol);
                                //Si se ha encontrado el rol de la base de datos a dar en el servidor continuamos
                                if (role) {
                                    //Si el rol a dar está por debajo de los roles del bot, le damos el rol
                                    if (usuario.guild.me.roles.highest.rawPosition > role.position) {
                                        await usuario.roles.add(rol).catch((e) => { e });
                                        //Si no, entonces hacemos return respondiendo que el bot no tiene permisos
                                    } else {
                                        reaction.message.channel.send(`❌ **No tengo suficientes permisos para dar el rol!**\nAsegúrate de mi rol esté por encima del rol a dar!`).catch(() => { }).then(msg => {
                                            setTimeout(() => {
                                                msg.delete()
                                            }, 3000);
                                        });
                                    }
                                    //Si el rol no se ha encontrado en el servidor, significa que ha sido eliminado
                                } else {
                                    reaction.message.channel.send(`❌ **Ese rol ha sido eliminado!**`).catch(() => { }).then(msg => {
                                        setTimeout(() => {
                                            msg.delete()
                                        }, 3000);
                                    });
                                }
                            } catch (e) { console.log(e) }
                            //Si el emoji reaccionado no tiene ID, significa que es de Discord
                        } else if (reaction.emoji?.name == parametros[k].Emoji) {
                            try {
                                rol = parametros[k].Rol;
                                let role = reaction.message.guild.roles.cache.get(parametros[k].Rol);
                                //Si se ha encontrado el rol de la base de datos a dar en el servidor continuamos
                                if (role) {
                                    //Si el rol a dar está por debajo de los roles del bot, le damos el rol
                                    if (usuario.guild.me.roles.highest.rawPosition > role.position) {
                                        await usuario.roles.add(rol).catch((e) => { e });
                                        //Si no, entonces hacemos return respondiendo que el bot no tiene permisos
                                    } else {
                                        reaction.message.channel.send(`❌ **No tengo suficientes permisos para dar el rol!**\nAsegúrate de mi rol esté por encima del rol a dar!`).catch(() => { }).then(msg => {
                                            setTimeout(() => {
                                                msg.delete()
                                            }, 3000);
                                        });
                                    }
                                    //Si el rol no se ha encontrado en el servidor, significa que ha sido eliminado
                                } else {
                                    reaction.message.channel.send(`❌ **Ese rol ha sido eliminado!**`).catch(() => { }).then(msg => {
                                        setTimeout(() => {
                                            msg.delete()
                                        }, 3000);
                                    });
                                }
                            } catch (e) { console.log(e) }
                        } else {
                            continue;
                        }
                    }
                }
            }
        } catch (e) {
            console.log(e)
        }
    });
    //QUITAR ROLES AL QUITAR LA REACCIÓN
    client.on("messageReactionRemove", async (reaction, user) => {
        try {
            //Comprobaciones previas (Si el usuario que añade la reacción es un bot o no hay server return)
            if (user.bot || !reaction.message.guild) return;
            //Comprobaciones previas (Si la reacción es parcial, la guardamos)
            if (reaction.partial) await reaction.fetch().catch(() => { });
            //Comprobaciones previas (Si la el mensaje de la reacción es parcial, la guardamos)
            if (reaction.message && reaction.message.partial) await reaction.message.fetch();
            //Aseguramos la base de datos en caso de que no haya una
            await asegurar_todo(reaction.message.guild.id);
            //Cargamos la base de datos
            const setup = await setupSchema.findOne({ guildID: reaction.message.guild.id });
            const reaccionroles = setup.reaccion_roles;
            //Comprobaciones previas (Si no hay un setup de reacciones, return)
            if (!reaccionroles || !reaccionroles.length || reaccionroles.length === 0 || reaccionroles === undefined || reaccionroles === null) return;
            //Hacemos un bucle entre todas las configuraciones de las reacciones
            for (let i = 0; i < reaccionroles.length; i++) {
                //Si la id del mensaje de la reacción coincide con una de la base de datos, continuamos
                if (reaction.message.id === reaccionroles[i].ID_MENSAJE) {
                    let usuario = await reaction.message.guild.members.cache.get(user.id);
                    let parametros = reaccionroles[i].Parametros;
                    let rol;
                    //Hacemos un bucle en los parámetros de la configuración de la reacción con roles encontrada
                    for (let k = 0; k < parametros.length; k++) {
                        //Si el emoji reaccionado tiene ID, significa que es personalizado (del servidor)
                        if (reaction.emoji?.id == parametros[k].Emoji) {
                            try {
                                rol = parametros[k].Rol;
                                let role = reaction.message.guild.roles.cache.get(parametros[k].Rol);
                                //Si se ha encontrado el rol de la base de datos a dar en el servidor continuamos
                                if (role) {
                                    //Si el rol a dar está por debajo de los roles del bot, le quitamos el rol
                                    if (usuario.guild.me.roles.highest.rawPosition > role.position) {
                                        //Si el usuario TIENE el rol, se lo quitamos
                                        if (usuario.roles.cache.has(rol)) await usuario.roles.remove(rol).catch(() => { });
                                    } else {
                                        //Si no, entonces hacemos return respondiendo que el bot no tiene permisos
                                        reaction.message.channel.send(`❌ **No tengo suficientes permisos para dar el rol!**\nAsegúrate de mi rol esté por encima del rol a dar!`).catch(() => { }).then(msg => {
                                            setTimeout(() => {
                                                msg.delete()
                                            }, 3000);
                                        });
                                    }
                                } else {
                                    //Si el rol no se ha encontrado en el servidor, significa que ha sido eliminado
                                    reaction.message.channel.send(`❌ **Ese rol ha sido eliminado!**`).catch(() => { }).then(msg => {
                                        setTimeout(() => {
                                            msg.delete()
                                        }, 3000);
                                    });
                                }
                            } catch (e) { console.log(e) }
                        //Si el emoji reaccionado no tiene ID, significa que es de Discord
                        } else if (reaction.emoji?.name == parametros[k].Emoji) {
                            try {
                                rol = parametros[k].Rol;
                                let role = reaction.message.guild.roles.cache.get(parametros[k].Rol);
                                //Si se ha encontrado el rol de la base de datos a dar en el servidor continuamos
                                if (role) {
                                    //Si el rol a dar está por debajo de los roles del bot, le quitamos el rol
                                    if (usuario.guild.me.roles.highest.rawPosition > role.position) {
                                        //Si el usuario TIENE el rol, se lo quitamos
                                        if (usuario.roles.cache.has(rol)) await usuario.roles.remove(rol).catch(() => { });
                                    } else {
                                        //Si no, entonces hacemos return respondiendo que el bot no tiene permisos
                                        reaction.message.channel.send(`❌ **No tengo suficientes permisos para dar el rol!**\nAsegúrate de mi rol esté por encima del rol a dar!`).catch(() => { }).then(msg => {
                                            setTimeout(() => {
                                                msg.delete()
                                            }, 3000);
                                        });
                                    }
                                } else {
                                    //Si el rol no se ha encontrado en el servidor, significa que ha sido eliminado
                                    reaction.message.channel.send(`❌ **Ese rol ha sido eliminado!**`).catch(() => { }).then(msg => {
                                        setTimeout(() => {
                                            msg.delete()
                                        }, 3000);
                                    });
                                }
                            } catch (e) { console.log(e) }
                        } else {
                            continue;
                        }
                    }
                }
            }
        } catch (e) {
            console.log(e)
        }
    });
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarollado por dewstouh#1088 || - ||    ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
