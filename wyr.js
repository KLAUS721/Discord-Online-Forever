const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const questions = [
  { a: 'Be able to fly', b: 'Be invisible' },
  { a: 'Live without music', b: 'Live without movies' },
  { a: 'Have more time', b: 'Have more money' },
  { a: 'Be always hot', b: 'Be always cold' },
  { a: 'Read minds', b: 'See the future' },
];

module.exports = {
  name: 'wyr',
  description: 'Would you rather...? Get a random question!',
  slashData: new SlashCommandBuilder()
    .setName('wyr')
    .setDescription('Would you rather...? Get a random question!'),
  async execute(message) {
    const { a, b } = questions[Math.floor(Math.random() * questions.length)];
    const embed = new EmbedBuilder()
      .setColor(0x27ae60)
      .setTitle('🤔 Would You Rather...')
      .setDescription(`**A:** ${a}\n**B:** ${b}`);
    await message.channel.send({ embeds: [embed] });
  },
  async slashExecute(interaction) {
    const { a, b } = questions[Math.floor(Math.random() * questions.length)];
    const embed = new EmbedBuilder()
      .setColor(0x27ae60)
      .setTitle('🤔 Would You Rather...')
      .setDescription(`**A:** ${a}\n**B:** ${b}`);
    await interaction.reply({ embeds: [embed] });
  }
}; 