const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, Message, Events } = require('discord.js');
const { client } = require('../../App/index.js');
const PLAYER = require('../../modules/Player.js');
const STATS = require('../../modules/Stats.js')
module.exports = {
    info: {
        names: ['signup']
    },
    data: new SlashCommandBuilder()
        .setName('signup')
        .setDescription('Create your Project Degenerate Account'),
    async execute(interaction) {
        console.log("hello");
        var user = message.author;
        var playerCreateEmbed = new EmbedBuilder()
        .setColor('#9696ab')
        .setTitle(`${user.username}'s Account`)
        .setDescription(`Warning: This Bot is in development! Thanks for trying us out!`)
        .setTimestamp();
        try {
            let stats = await STATS.findOne({ botID: 899 });
            let player = await PLAYER.findOne({ userID: user.id });
            if (!player) {
            let accountPlayer = new PLAYER({
                userId: user.id,
                name: user.username,
                gems: 0,
                crystals: 0,
                level: 1,
                characters:[],
                xp: 0,
                stage: 1-1,
                normalTicket: 0,
                specialTicket: 0,
                gearNormalTicket: 0,
                gearSpecialTicket: 0,


            })
            await accountPlayer.save();
            stats.PlayerCount += 1;
            await stats.save();

            playerCreateEmbed.addFields([
                { name: `You are about to to enter the world of **Project Degenerate**`, value: `use /help to see a list of commands!` }
            ]);            

             await interaction.reply({ embeds: [playerCreateEmbed] });
            }
            else{
                await interaction.reply(`You are already a player!`)
            }
        } catch (error) {
            console.log(error);
        }
    },
};