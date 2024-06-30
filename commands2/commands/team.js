const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, Message, Events, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { client } = require('../../App/index.js');
const PLAYER = require('../../modules/Player.js');
const STATS = require('../../modules/Stats.js');
const characters = require('../../config/characters.json');
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
                   .setFooter('Team')
                   .setTimestamp();

                   let totalAtk = 0;
                   let totalDef = 0;
                   let totalHp = 0;
                   let totalSpeed = 0;
                   let totalCrit = 0;
               
4               
                for (let i = 0; i < user.team.length; i++) {
                    const character = user.characters.find(c => c.Id === user.team[i]);
                    if (character) {
                        embed.addField(character.Name, character.Description);
                        totalAtk += character.baseAtk;
                        totalDef += character.baseDef;
                        totalHp += character.baseHp;
                        totalSpeed += character.baseSpeed;
                        totalCrit += character.baseCrit;
                    }
                }

                embed.addFields(
                    { name: 'Total Attack', value: totalAtk.toString(), inline: true },
                    { name: 'Total Defense', value: totalDef.toString(), inline: true },
                    { name: 'Total HP', value: totalHp.toString(), inline: true },
                    { name: 'Total Speed', value: totalSpeed.toString(), inline: true },
                    { name: 'Total Critical', value: totalCrit.toString(), inline: true }
                );

                return interaction.reply({ embeds: [embed] });
                }

            if (interaction.options.getSubcommand() === 'edit') {
                //Edit team
                if (interaction.options.getSubcommand() === 'edit') {
                    const select = new StringSelectMenuBuilder()
                        .setCustomId('select')
                        .setPlaceholder('Select your characters');
                
                    user.characters.forEach(character => {
                        select.addOptions({
                            label: characters[character].name,
                            description: characters[character].description,
                            value: character,
                        });
                    });
                
                    const row = new ActionRowBuilder()
                        .addComponents(select);
                
                    await interaction.reply({ content: 'Select your characters:', components: [row] });

                    client.on(Events.InteractionCreate, async interaction => {
                        if (!interaction.isStringSelectMenu()) return;
                    
                        if (interaction.customId === 'select') {
                            const selected = interaction.values;
                    
                            // Update the user's team with the selected characters
                            user.team = selected;
                            await user.save();
                    
                            await interaction.update({ content: `Your team has been updated!`, components: [] });
                        }
                    });
                    
                }
                
            }
        },
    }