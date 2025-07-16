const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const words = ['discord', 'javascript', 'minigame', 'challenge', 'winner', 'typing', 'speed', 'bot', 'server', 'community'];

module.exports = {
  name: 'typerace',
  description: 'Type the word as fast as you can!',
  slashData: new SlashCommandBuilder()
    .setName('typerace')
    .setDescription('Type the word as fast as you can!'),
  async execute(message) {
    const word = words[Math.floor(Math.random() * words.length)];
    const embed = new EmbedBuilder()
      .setColor(0xe67e22)
      .setTitle('⌨️ Type Race!')
      .setDescription(`First to type the word below wins!\n\n**${word}**`);
    await message.channel.send({ embeds: [embed] });
    const filter = m => m.content.toLowerCase() === word.toLowerCase();
    const collector = message.channel.createMessageCollector({ filter, time: 20000 });
    collector.on('collect', m => {
      collector.stop('winner');
      m.reply('🏆 You typed it first! Congratulations!');
    });
    collector.on('end', (collected, reason) => {
      if (reason !== 'winner') {
        message.channel.send('⏰ Time\'s up! No one typed the word.');
      }
    });
  },
  async slashExecute(interaction) {
    const word = words[Math.floor(Math.random() * words.length)];
    const embed = new EmbedBuilder()
      .setColor(0xe67e22)
      .setTitle('⌨️ Type Race!')
      .setDescription(`First to type the word below wins!\n\n**${word}**`);
    await interaction.reply({ embeds: [embed] });
    const filter = m => m.content.toLowerCase() === word.toLowerCase();
    const channel = await interaction.channel;
    const collector = channel.createMessageCollector({ filter, time: 20000 });
    collector.on('collect', m => {
      collector.stop('winner');
      m.reply('🏆 You typed it first! Congratulations!');
    });
    collector.on('end', (collected, reason) => {
      if (reason !== 'winner') {
        channel.send('⏰ Time\'s up! No one typed the word.');
      }
    });
  }
}; 