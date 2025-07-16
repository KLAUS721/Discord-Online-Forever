const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'guess',
  description: 'Guess the number between 1 and 100!',
  slashData: new SlashCommandBuilder()
    .setName('guess')
    .setDescription('Guess the number between 1 and 100!'),
  async execute(message) {
    const number = Math.floor(Math.random() * 100) + 1;
    const filter = m => m.author.id === message.author.id && !isNaN(m.content);
    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle('🎲 Guess the Number!')
      .setDescription('I have picked a number between 1 and 100. Try to guess it!');
    await message.channel.send({ embeds: [embed] });
    let attempts = 0;
    const collector = message.channel.createMessageCollector({ filter, time: 30000 });
    collector.on('collect', m => {
      attempts++;
      const guess = parseInt(m.content);
      if (guess === number) {
        collector.stop('guessed');
        m.reply(`🎉 Correct! The number was **${number}**. Attempts: ${attempts}`);
      } else if (guess < number) {
        m.reply('🔼 Higher!');
      } else {
        m.reply('🔽 Lower!');
      }
    });
    collector.on('end', (collected, reason) => {
      if (reason !== 'guessed') {
        message.channel.send(`⏰ Time's up! The number was **${number}**.`);
      }
    });
  },
  async slashExecute(interaction) {
    const number = Math.floor(Math.random() * 100) + 1;
    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle('🎲 Guess the Number!')
      .setDescription('I have picked a number between 1 and 100. Reply with your guess!');
    await interaction.reply({ embeds: [embed] });
    const filter = m => m.author.id === interaction.user.id && !isNaN(m.content);
    const channel = await interaction.channel;
    let attempts = 0;
    const collector = channel.createMessageCollector({ filter, time: 30000 });
    collector.on('collect', m => {
      attempts++;
      const guess = parseInt(m.content);
      if (guess === number) {
        collector.stop('guessed');
        m.reply(`🎉 Correct! The number was **${number}**. Attempts: ${attempts}`);
      } else if (guess < number) {
        m.reply('🔼 Higher!');
      } else {
        m.reply('🔽 Lower!');
      }
    });
    collector.on('end', (collected, reason) => {
      if (reason !== 'guessed') {
        channel.send(`⏰ Time's up! The number was **${number}**.`);
      }
    });
  }
}; 