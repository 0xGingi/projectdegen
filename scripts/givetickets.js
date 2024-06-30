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
    const players = await PLAYER.find({});
    for (const player of players) {
        player.normalTicket += 10;
        player.specialTicket += 10;
        player.save();
    }
} catch (err) {
    console.log(err)
}
   }
run ();