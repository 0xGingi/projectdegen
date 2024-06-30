const mongoose = require('mongoose')

const playerSchema = mongoose.Schema({
    userID: String,
    name: String,
    gems: Number,
    crystals: Number,
    level: Number,
    characters:[
        {
            Id: String,
            Name: String,
            Level: Number,
            Class: String,
            Race: String,
            Description: String,
            baseAtk: Number,
            baseDef: Number,
            baseHp: Number,
            baseSpeed: Number,
            baseCrit: Number,
            dupes: Number,
        }
    ],
    xp: Number,
    stage: String,
    normalTicket: Number,
    specialTicket: Number,
    gearNormalTicket: Number,
    gearSpecialTicket: Number,
    team: [String]
})
module.exports = mongoose.model('players', playerSchema)
