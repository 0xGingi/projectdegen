const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, Message, Events } = require('discord.js');
const { client } = require('../../App/index.js');
const PLAYER = require('../../modules/Player.js');
const STATS = require('../../modules/Stats.js');
const STAGES = require('../../config/stages.json');
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

        const userDamage = userAtk * (1 + userCrit / 100) - enemy.baseDef;
        const enemyDamage = enemy.baseAtk - userDef;

        let userHpRemaining = userHp;
        let enemyHpRemaining = enemy.baseHp;

        while (userHpRemaining > 0 && enemyHpRemaining > 0) {
            if (userSpd >= enemy.baseSpd) {
                enemyHpRemaining -= userDamage;
                if (enemyHpRemaining > 0) {
                    userHpRemaining -= enemyDamage;
                }
            } else {
                userHpRemaining -= enemyDamage;
                if (userHpRemaining > 0) {
                    enemyHpRemaining -= userDamage;
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
