const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const PLAYER = require('../../modules/Player.js');

module.exports = {
    info: {
        names: ['characters']
    },
    data: new SlashCommandBuilder()
        .setName('characters')
        .setDescription('Show your existing characters')
        .addStringOption(option =>
            option.setName('character_name')
                .setDescription('The name of the character to view')
                .setRequired(false)
        ),
    async execute(interaction) {
        const characterName = interaction.options.getString('character_name');

        const user = await PLAYER.findOne({ userID: interaction.user.id });

        if (!user) {
            return interaction.reply('You are not registered in the database.');
        }

        if (user.characters.length === 0) {
            return interaction.reply('You do not have any characters.');
        }

        if (characterName) {
            const character = user.characters.find(c => c.Name.toLowerCase() === characterName.toLowerCase());

            if (!character) {
                return interaction.reply(`You do not have a character named ${characterName}.`);
            }

            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(character.Name)
                .setDescription(character.Description)
                .setImage(character.ImageURL)
                .addFields(
                    { name: 'Level', value: character.Level.toString(), inline: true },
                    { name: 'Class', value: character.Class, inline: true },
                    { name: 'Race', value: character.Race, inline: true },
                    { name: 'Duplicates', value: character.dupes.toString(), inline: true },
                    { name: 'Base Attack', value: character.baseAtk.toString(), inline: true },
                    { name: 'Base Defense', value: character.baseDef.toString(), inline: true },
                    { name: 'Base HP', value: character.baseHp.toString(), inline: true },
                    { name: 'Base Speed', value: character.baseSpeed.toString(), inline: true },
                    { name: 'Base Crit', value: character.baseCrit.toString(), inline: true },
                );

            return interaction.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`${interaction.user.username}'s Characters`)
                .setDescription('Here are your existing characters:');

            user.characters.forEach(character => {
                embed.addFields({ name: character.Name, value: `Level: ${character.Level}\nClass: ${character.Class}\nRace: ${character.Race}\nDuplicates: ${character.dupes}` });
            });

            return interaction.reply({ embeds: [embed] });
        }
    },
};
