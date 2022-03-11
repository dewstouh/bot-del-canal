const mongoose = require('mongoose');

const warnings = new mongoose.Schema({
    guildID: String,
    userID: String,
    warnings: {type: Array, default: []}
})

const model = mongoose.model("warnings", warnings);

module.exports = model;

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarollado por dewstouh#1088 || - ||    ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
