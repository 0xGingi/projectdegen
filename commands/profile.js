const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, Message, Events, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { client } = require('../App/index.js');
const PLAYER = require('../modules/Player.js');
const STATS = require('../modules/Stats.js');
const characters = require('../config/characters.json');
module.exports = {
    info: {
        names: ['profile']
    },
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('view your profile'),
    async execute(interaction) {
        const user = await PLAYER.findOne({ userID: interaction.user.id });
        if (!user) {
            return interaction.reply('You are not registered in the database.');
        }
        const embed = new EmbedBuilder()
        .setTitle(`${user.name}`)
        .setDescription(`${user.name}'s Profile`)
        .setColor(0x00ff00)
        .setThumbnail(interaction.user.displayAvatarURL())
        .setTimestamp();

        const fields = [];
        let totalAtk = 0;
        let totalDef = 0;

            for (let i = 0; i < user.team.length; i++) {
                const character = user.characters.find(c => c.Id === user.team[i]);
                if (character) {
                    fields.push({ name: character.Name, value: character.Description });
                    totalAtk += character.baseAtk;
                    totalDef += character.baseDef;
                }
            }

        let power = totalAtk + (totalDef / 2);

        embed.addFields([
            { name: `Progress`, value: `Level: ${user.level}\nXP: ${user.xp}\nStage: ${user.stage}`, inline: true },
            { name: `Currency`, value: `Normal Tickets: ${user.normalTicket}\nSpecial Tickets: ${user.specialTicket}\nCrystals: ${user.crystals}\nGems: ${user.gems}`, inline: true },
            { name: `Team Power`, value: `${power}`, inline: true }

        ]);     
        
        await interaction.reply({ embeds: [embed] });

    },
}
