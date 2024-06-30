const mongoose = require('mongoose')

const statSchema = mongoose.Schema({
    botID: Number,
    PlayerCount: Number,
    totalSummons: Number,
})

module.exports = mongoose.model('stats', statSchema)