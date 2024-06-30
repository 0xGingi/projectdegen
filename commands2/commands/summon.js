const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, Message, Events } = require('discord.js');
const { client } = require('../../App/index.js');
const PLAYER = require('../../modules/Player.js');
const STATS = require('../../modules/Stats.js');

module.exports = {
    info: {
        names: ['summon']
    },
    data: new SlashCommandBuilder()
        .setName('summon')
        .setDescription('Summon on a banner!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('normal')
                .setDescription('Summon on a normal banner')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('special')
                .setDescription('Summon on a special banner')
        ),
        async execute(interaction) {
            const user = await PLAYER.findOne({ userID: interaction.user.id });
        
            if (!user) {
                return interaction.reply('You are not registered in the database.');
            }
        
            if (interaction.options.getSubcommand() === 'normal') {
                if (user.normalTicket <= 0) {
                    return interaction.reply('You do not have enough normal tickets.');
                }
        
                user.normalTicket -= 1;
                const character = getRandomCharacter('Normal');
                const existingCharacter = user.characters.find(c => c.Id === character.id);
        
                if (existingCharacter) {
                    existingCharacter.baseAtk += 100;
                    existingCharacter.baseDef += 100;
                    existingCharacter.baseHp += 100;
                    existingCharacter.baseSpeed += 100;
                    existingCharacter.baseCrit += 100;
                    existingCharacter.dupes += 1;
                } else {
                    user.characters.push({
                        Id: character.id,
                        Name: character.name,
                        Level: character.level,
                        Class: character.class,
                        Race: character.race,
                        Description: character.Description,
                        baseAtk: character.baseAttack,
                        baseDef: character.baseDefense,
                        baseHp: character.baseHp,
                        baseSpeed: character.baseSpeed,
                        baseCrit: character.baseCrit,
                        dupes: 1,
                    });
                }
        
            } else if (interaction.options.getSubcommand() === 'special') {
                if (user.specialTicket <= 0) {
                    return interaction.reply('You do not have enough special tickets.');
                }
        
                user.specialTicket -= 1;
                const character = getRandomCharacter('Special');
                const existingCharacter = user.characters.find(c => c.Id === character.id);
        
                if (existingCharacter) {
                    existingCharacter.baseAtk += 100;
                    existingCharacter.baseDef += 100;
                    existingCharacter.baseHp += 100;
                    existingCharacter.baseSpeed += 100;
                    existingCharacter.baseCrit += 100;
                    existingCharacter.dupes += 1;
                } else {
                    user.characters.push({
                        Id: character.id,
                        Name: character.name,
                        Level: character.level,
                        Class: character.class,
                        Race: character.race,
                        Description: character.Description,
                        baseAtk: character.baseAttack,
                        baseDef: character.baseDefense,
                        baseHp: character.baseHp,
                        baseSpeed: character.baseSpeed,
                        baseCrit: character.baseCrit,
                        dupes: 1,
                    });
                }
            }
        
            await user.save();
            return interaction.reply(`You have summoned ${character.name}!`);
        },
        };

function getRandomCharacter(banner) {
    const eligibleCharacters = characters.filter(character => character.banner === banner && character.onGoing === 1);
    const totalChance = eligibleCharacters.reduce((sum, character) => sum + character.chance, 0);
    let random = Math.random() * totalChance;

    for (let character of eligibleCharacters) {
        if (random < character.chance) {
            return character;
        }
        random -= character.chance;
    }
}