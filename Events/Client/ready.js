const { Events, ActivityType, Client, Status } = require('discord.js')
const { dim, yellow } = require('colors')
module.exports = {
    name: Events.ClientReady,
    async execute(client){
                console.log(`\n${dim('User:')} ${yellow(client.user.tag)}\n`)
                console.log(`${dim('-----------------------------------------------------------')}`)
                console.log(`\n${dim('Developed by:')} ${yellow('0xGingi | https://github.com/0xGingi ')}`)
    }
}