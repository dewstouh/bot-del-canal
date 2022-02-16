const mongoose = require('mongoose');

const setupSchema = new mongoose.Schema({
    guildID: String,
    reaccion_roles: Array,
})

const model = mongoose.model("Configuraciones", setupSchema);

module.exports = model;