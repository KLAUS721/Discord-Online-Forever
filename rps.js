const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const choices = ['rock', 'paper', 'scissors'];

module.exports = {
  name: 'rps',
  description: 'Play Rock Paper Scissors against the bot!',
  slashData: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Play Rock Paper Scissors against the bot!')
    .addStringOption(opt =>
      opt.setName('choice')
        .setDescription('Your choice: rock, paper, or scissors')
        .setRequired(true)
        .addChoices(
          { name: 'Rock', value: 'rock' },
          { name: 'Paper', value: 'paper' },
          { name: 'Scissors', value: 'scissors' }
        )
    ),
  async execute(message, args) {
    const userChoice = (args[0] || '').toLowerCase();
    if (!choices.includes(userChoice)) {
      return message.reply('Please choose: rock, paper, or scissors. Example: !rps rock');
    }
    const botChoice = choices[Math.floor(Math.random() * 3)];
    const result = getResult(userChoice, botChoice);
    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle('✊🖐✌ Rock Paper Scissors')
      .setDescription(`You chose **${userChoice}**
Bot chose **${botChoice}**

**${result}**`);
    await message.channel.send({ embeds: [embed] });
  },
  async slashExecute(interaction) {
    const userChoice = interaction.options.getString('choice');
    const botChoice = choices[Math.floor(Math.random() * 3)];
    const result = getResult(userChoice, botChoice);
    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle('✊🖐✌ Rock Paper Scissors')
      .setDescription(`You chose **${userChoice}**
Bot chose **${botChoice}**

**${result}**`);
    await interaction.reply({ embeds: [embed] });
  }
};

function getResult(user, bot) {
  if (user === bot) return 'It\'s a draw!';
  if (
    (user === 'rock' && bot === 'scissors') ||
    (user === 'paper' && bot === 'rock') ||
    (user === 'scissors' && bot === 'paper')
  ) return 'You win!';
  return 'You lose!';
} 