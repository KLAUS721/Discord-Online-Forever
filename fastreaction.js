const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const symbols = ['@', '#', '$', '%', '&', '*', '!', '?', '+', '='];

module.exports = {
  name: 'fastreaction',
  description: 'Type the symbol as fast as you can!',
  slashData: new SlashCommandBuilder()
    .setName('fastreaction')
    .setDescription('Type the symbol as fast as you can!'),
  async execute(message) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const embed = new EmbedBuilder()
      .setColor(0x00bfff)
      .setTitle('⚡ Fast Reaction!')
      .setDescription(`Type the following symbol as fast as you can:\n\n**${symbol}**`);
    await message.channel.send({ embeds: [embed] });
    const filter = m => m.content.trim() === symbol;
    const collector = message.channel.createMessageCollector({ filter, time: 15000 });
    collector.on('collect', m => {
      collector.stop('winner');
      m.reply('🏆 Fastest! You win!');
    });
    collector.on('end', (collected, reason) => {
      if (reason !== 'winner') {
        message.channel.send(`⏰ Time's up! The symbol was: ${symbol}`);
      }
    });
  },
  async slashExecute(interaction) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const embed = new EmbedBuilder()
      .setColor(0x00bfff)
      .setTitle('⚡ Fast Reaction!')
      .setDescription(`Type the following symbol as fast as you can:\n\n**${symbol}**`);
    await interaction.reply({ embeds: [embed] });
    const filter = m => m.content.trim() === symbol;
    const channel = await interaction.channel;
    const collector = channel.createMessageCollector({ filter, time: 15000 });
    collector.on('collect', m => {
      collector.stop('winner');
      m.reply('🏆 Fastest! You win!');
    });
    collector.on('end', (collected, reason) => {
      if (reason !== 'winner') {
        channel.send(`⏰ Time's up! The symbol was: ${symbol}`);
      }
    });
  }
}; 