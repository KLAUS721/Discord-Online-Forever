const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'coinflip',
  description: 'Flip a coin!',
  slashData: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flip a coin!'),
  async execute(message) {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    const embed = new EmbedBuilder()
      .setColor(0x95a5a6)
      .setTitle('🪙 Coin Flip')
      .setDescription(`The coin landed on **${result}**!`);
    await message.channel.send({ embeds: [embed] });
  },
  async slashExecute(interaction) {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    const embed = new EmbedBuilder()
      .setColor(0x95a5a6)
      .setTitle('🪙 Coin Flip')
      .setDescription(`The coin landed on **${result}**!`);
    await interaction.reply({ embeds: [embed] });
  }
}; 