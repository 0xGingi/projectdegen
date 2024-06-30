const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { client } = require('../App/index.js');
const PLAYER = require('../modules/Player.js');
const STATS = require('../modules/Stats.js');
const characters = require('../config/characters.json');

module.exports = {
    info: {
        names: ['team']
    },
    data: new SlashCommandBuilder()
        .setName('team')
        .setDescription('view/edit your team')
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('View your team')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('edit')
                .setDescription('Edit your team')
                .addStringOption(option =>
                    option.setName('slot')
                        .setDescription('The slot to edit')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Slot 1', value: '0' },
                            { name: 'Slot 2', value: '1' },
                            { name: 'Slot 3', value: '2' },
                            { name: 'Slot 4', value: '3' },
                        )
                )
        ),
    async execute(interaction) {
        const user = await PLAYER.findOne({ userID: interaction.user.id });
        if (!user) {
            return interaction.reply('You are not registered in the database.');
        }

        if (interaction.options.getSubcommand() === 'view') {
            const embed = new EmbedBuilder()
                .setTitle('Team')
                .setDescription('Your team')
                .setColor(0x00ff00)
                .setThumbnail(interaction.user.displayAvatarURL())
                .setFooter({ text: 'Team' })
                .setTimestamp();
                for (let i = 0; i < user.team.length; i++) {
                    const character = user.characters.find(c => c.Id === user.team[i]);
                    embed.addFields([
                        { name: character.Name, value: character.Description }
                    ]);
                    
                }
                            
                return interaction.reply({ embeds: [embed] });
        }

        if (interaction.options.getSubcommand() === 'edit') {
            const slotSelect = new StringSelectMenuBuilder()
                .setCustomId('slotSelect')
                .setPlaceholder('Select a slot')
                .addOptions(
                    { label: 'Slot 1', value: '0' },
                    { label: 'Slot 2', value: '1' },
                    { label: 'Slot 3', value: '2' },
                    { label: 'Slot 4', value: '3' },
                );
        
            const row = new ActionRowBuilder()
                .addComponents(slotSelect);
        
            await interaction.reply({ content: 'Select a slot to edit', components: [row] });
        
            const filter = i => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
        
            collector.on('collect', async i => {
                if (i.customId === 'slotSelect') {
                    const selectedSlot = i.values[0];
        
                    const characterSelect = new StringSelectMenuBuilder()
                        .setCustomId('characterSelect')
                        .setPlaceholder('Select a character');
        
                    for (const character of user.characters) {
                        characterSelect.addOptions({
                            label: character.Name,
                            description: character.Description,
                            value: String(character.Id),
                        });
                    }
        
                    const row = new ActionRowBuilder()
                        .addComponents(characterSelect);
        
                    await i.update({ content: 'Select a character for the slot', components: [row] });
        
                    const characterCollector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
        
                    characterCollector.on('collect', async j => {
                        if (j.customId === 'characterSelect') {
                            const selectedCharacterID = j.values[0];
                            const selectedCharacter = user.characters.find(character => character.Id === selectedCharacterID.toString());
                            if (!selectedCharacter) {
                                return j.update({ content: `**${selectedCharacter.Name}** not found in your characters array.`, components: [] });
                            }

                            if (user.team.includes(selectedCharacter.Id)) {
                                return j.update({ content: `**${selectedCharacter.Name}** is already in your team.`, components: [] });
                            }                    
                            const selectedCharacterId = selectedCharacter.Id;
                            user.team[selectedSlot] = selectedCharacterId;
                            await user.save();
                            await j.update({ content: `**${selectedCharacter.Name}** has been added to slot ${parseInt(selectedSlot) + 1}`, components: [] });
                        }
                    });
                                                                                        
                    characterCollector.on('end', collected => {
                        if (collected.size === 0) {
                            interaction.editReply({ content: 'No character was selected.', components: [] });
                        }
                    });
                }
            });
        
            collector.on('end', collected => {
                if (collected.size === 0) {
                    interaction.editReply({ content: 'No slot was selected.', components: [] });
                }
            });
        }
        
    },
}
