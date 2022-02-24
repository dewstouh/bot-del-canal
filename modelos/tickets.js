const mongoose = require('mongoose');

const tickets = new mongoose.Schema({
    guildID: String,
    autor: String,
    canal: String,
    cerrado: {type: Boolean, default: false}
})

const model = mongoose.model("Tickets_Creados", tickets);

module.exports = model;

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarollado por dewstouh#1088 || - ||    ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
