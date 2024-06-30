const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, Message, Events } = require('discord.js');
const { client } = require('../App/index.js');
const PLAYER = require('../modules/Player.js');
const STATS = require('../modules/Stats.js');
const STAGES = require('../config/stages.json');
const CharacterJSON = require('../config/characters.json');
module.exports = {
    info: {
        names: ['fight']
    },
    data: new SlashCommandBuilder()
        .setName('fight')
        .setDescription('Fight'),
    async execute(interaction) {
        const user = await PLAYER.findOne({ userID: interaction.user.id });
        if (!user) {
            return interaction.reply('You are not registered in the database.');
        }
        const userCharacter = user.characters.find(c => c.Id === user.team[0]);
        if (!userCharacter) {
            return interaction.reply('You do not have a character in your team.');
        }
        const characterData = CharacterJSON.find(c => c.id === parseInt(userCharacter.Id));
        if (!characterData) {
            return interaction.reply(`Could not find data for character with ID ${userCharacter.Id}.`);
        }
        const characterImageURL = characterData.ImageURL;
        const stage = user.stage;
        const enemy = STAGES.find(s => s.stage === stage);
        if (!enemy) {
            return interaction.reply(`There is no enemy for stage ${stage}.`);
        }

        let userAtk = 0;
        let userDef = 0;
        let userHp = 0;
        let userSpd = 0;
        let userCrit = 0;

        for (let i = 0; i < user.team.length; i++) {
            const character = user.characters.find(c => c.Id === user.team[i]);
            if (character) {
                userAtk += character.baseAtk;
                userDef += character.baseDef;
                userHp += character.baseHp;
                userSpd += character.baseSpeed;
                userCrit += character.baseCrit;
            }
        }

        //const userDamage = userAtk * (1 + userCrit / 100) - enemy.baseDef;
        const userDamage = userAtk - enemy.baseDef;
        const enemyDamage = enemy.baseAtk - userDef;

        let userHpRemaining = userHp;
        let enemyHpRemaining = enemy.baseHp;

        while (userHpRemaining > 0 && enemyHpRemaining > 0) {
            if (userSpd >= enemy.baseSpd) {
                let damageToEnemy = Math.floor(Math.random() * userAtk) + 1 - (enemy.baseDef * 0.5);
                damageToEnemy = isNaN(damageToEnemy) ? 1 : damageToEnemy;
                damageToEnemy = damageToEnemy < 0 ? 1 : damageToEnemy;
                enemyHpRemaining -= damageToEnemy;
                const userAttackEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Attack')
                    .setDescription(`You attacked ${enemy.Name} for ${damageToEnemy} damage. ${enemy.Name} has ${enemyHpRemaining} health remaining.`)
                    .setThumbnail(characterImageURL);
                    await interaction.channel.send({ embeds: [userAttackEmbed] });
                if (enemyHpRemaining > 0) {
                    let damageToUser = Math.floor(Math.random() * enemy.baseAtk) + 1 - (userDef * 0.5);
                    damageToUser = isNaN(damageToUser) ? 0 : damageToUser;
                    damageToUser = damageToUser < 0 ? 0 : damageToUser;
                    userHpRemaining -= damageToUser;
        
                    const enemyAttackEmbed = new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('Attack')
                        .setDescription(`${enemy.Name} attacked you for ${damageToUser} damage. You have ${userHpRemaining} health remaining.`)
                        .setThumbnail(enemy.ImageURL);
                    await interaction.channel.send({ embeds: [enemyAttackEmbed] });
                }
            } else {
                let damageToUser = Math.floor(Math.random() * enemy.baseAtk) + 1 - (userDef * 0.5);
                damageToUser = isNaN(damageToUser) ? 1 : damageToUser;
                damageToUser = damageToUser < 0 ? 1 : damageToUser;
                userHpRemaining -= damageToUser;
                const enemyAttackEmbed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('Attack')
                    .setDescription(`${enemy.Name} attacked you for ${damageToUser} damage. You have ${userHpRemaining} health remaining.`)
                    .setThumbnail(enemy.ImageURL);
                await interaction.channel.send({ embeds: [enemyAttackEmbed] });
                if (userHpRemaining > 0) {
                    let damageToEnemy = Math.floor(Math.random() * userAtk) + 1 - (enemy.baseDef * 0.5);
                    damageToEnemy = isNaN(damageToEnemy) ? 1 : damageToEnemy;
                    damageToEnemy = damageToEnemy < 0 ? 1 : damageToEnemy;
                    enemyHpRemaining -= damageToEnemy;
                    const userAttackEmbed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle('Attack')
                        .setDescription(`You attacked ${enemy.Name} for ${damageToEnemy} damage. ${enemy.Name} has ${enemyHpRemaining} health remaining.`)
                        .setThumbnail(characterImageURL);
                    await interaction.channel.send({ embeds: [userAttackEmbed] });
                }
            }
        }
                
                        
        function getNextStage(currentStage) {
            const [chapter, stage] = currentStage.split('-').map(Number);
            if (stage < 5) {
                return `${chapter}-${stage + 1}`;
            } else {
                return `${chapter + 1}-1`;
            }
        }
        
        if (userHpRemaining > 0) {
            //user.stage = getNextStage(stage);
            user.crystals += enemy.rewards[0].crystals;
            user.gems += enemy.rewards[0].gems;
            await user.save();
            return interaction.reply(`You defeated ${enemy.Name} and moved on to the next stage!`);
        } else {
            return interaction.reply(`You were defeated by ${enemy.Name}. Better luck next time!`);
        }


    },
}
