const mongoose = require('mongoose');

const votos_sugerencias = new mongoose.Schema({
    messageID: String,
    si: {type: Array, default: []},
    no: {type: Array, default: []},
    autor: {type: String, default: ""}
})

const model = mongoose.model("votos_sugerencias", votos_sugerencias);

module.exports = model;

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarollado por dewstouh#1088 || - ||    ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
