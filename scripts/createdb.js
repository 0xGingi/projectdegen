const PLAYER = require('../modules/Player.js')
const STATS = require('../modules/Stats.js')
const {client} = require('../App/index.js');
const mongoose = require('mongoose');
const config = require('../App/config.json');

mongoose
   .connect(config.mongodb, {})
   .then(() => console.log(`MongoDB Ready`));
   async function run() {
try {
var stats = new STATS({
    botID: 899,
    PlayerCount: 0,
    totalSummons: 0
})
stats.save()
} catch (err) {
    console.log(err)
}
   }
run ();