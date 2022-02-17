const fs = require('fs');
module.exports = (client) => {
    try {
        console.log(`
╔═════════════════════════════════════════════════════╗
║                                                     ║
║   Bienvenido al Handler /-/ por dewstouh#1088 /-/   ║
║                                                     ║
╚═════════════════════════════════════════════════════╝`.yellow)
        //definmos la variable comandos para luego ver el total de comandos cargados
        let comandos = 0;
        //leemos la carpeta de comandos y por cada carpeta filtramos los archivos que acaban en .js
        fs.readdirSync("./comandos/").forEach((carpeta) => {
            //Creamos la constante comandos que es igual a los comandos encontrados en cada categoría
            const commands = fs.readdirSync(`./comandos/${carpeta}`).filter((archivo) => archivo.endsWith(".js"));
            //Por cada comando de cada categoría lo cargamos y aumentamos +1 en la variable comandos
            for (let archivo of commands){
                let comando = require(`../comandos/${carpeta}/${archivo}`);
                //Si el comando está configurado correctamente lo cargamos
                if(comando.name) {
                    client.commands.set(comando.name, comando);
                    comandos++
                } else {
                    //Si no, logeamos que no se ha podido cargar
                    console.log(`COMANDO [/${carpeta}/${archivo}]`, `error => el comando no está configurado`.brightRed)
                    continue;
                }
                //Cargamos los aliases de los comandos en la la colección client.aliases
                if(comando.aliases && Array.isArray(comando.aliases)) comando.aliases.forEach((alias) => client.aliases.set(alias, comando.name));
            }
        });
        console.log(`${comandos} Comandos Cargados`.brightGreen);
    } catch(e){
        console.log(e)
    }
}
