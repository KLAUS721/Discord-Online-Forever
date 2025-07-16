const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const symbols = ['🍒', '🍋', '🍊', '🍉', '⭐', '💎'];

module.exports = {
  name: 'slot',
  description: 'Play the slot machine!',
  slashData: new SlashCommandBuilder()
    .setName('slot')
    .setDescription('Play the slot machine!'),
  async execute(message) {
    const spin = [0,0,0].map(() => symbols[Math.floor(Math.random() * symbols.length)]);
    const win = spin.every(s => s === spin[0]);
    const embed = new EmbedBuilder()
      .setColor(0xe84393)
      .setTitle('🎰 Slot Machine')
      .setDescription(`${spin.join(' | ')}\n\n${win ? '🎉 Jackpot! You win!' : 'Better luck next time!'}`);
    await message.channel.send({ embeds: [embed] });
  },
  async slashExecute(interaction) {
    const spin = [0,0,0].map(() => symbols[Math.floor(Math.random() * symbols.length)]);
    const win = spin.every(s => s === spin[0]);
    const embed = new EmbedBuilder()
      .setColor(0xe84393)
      .setTitle('🎰 Slot Machine')
      .setDescription(`${spin.join(' | ')}\n\n${win ? '🎉 Jackpot! You win!' : 'Better luck next time!'}`);
    await interaction.reply({ embeds: [embed] });
  }
}; 