const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const questions = [
  { q: 'What is the capital of France?', a: 'paris' },
  { q: 'Who wrote "Romeo and Juliet"?', a: 'shakespeare' },
  { q: 'What is the largest planet in our solar system?', a: 'jupiter' },
  { q: 'What year did World War II end?', a: '1945' },
  { q: 'What is the chemical symbol for water?', a: 'h2o' },
];

module.exports = {
  name: 'trivia',
  description: 'Answer a random trivia question!',
  slashData: new SlashCommandBuilder()
    .setName('trivia')
    .setDescription('Answer a random trivia question!'),
  async execute(message) {
    const { q, a } = questions[Math.floor(Math.random() * questions.length)];
    const embed = new EmbedBuilder()
      .setColor(0x8e44ad)
      .setTitle('❓ Trivia Time!')
      .setDescription(`First to answer correctly wins!\n\n**${q}**`);
    await message.channel.send({ embeds: [embed] });
    const filter = m => m.content.toLowerCase() === a;
    const collector = message.channel.createMessageCollector({ filter, time: 20000 });
    collector.on('collect', m => {
      collector.stop('winner');
      m.reply('🏆 Correct! You win!');
    });
    collector.on('end', (collected, reason) => {
      if (reason !== 'winner') {
        message.channel.send(`⏰ Time's up! The answer was **${a}**.`);
      }
    });
  },
  async slashExecute(interaction) {
    const { q, a } = questions[Math.floor(Math.random() * questions.length)];
    const embed = new EmbedBuilder()
      .setColor(0x8e44ad)
      .setTitle('❓ Trivia Time!')
      .setDescription(`First to answer correctly wins!\n\n**${q}**`);
    await interaction.reply({ embeds: [embed] });
    const filter = m => m.content.toLowerCase() === a;
    const channel = await interaction.channel;
    const collector = channel.createMessageCollector({ filter, time: 20000 });
    collector.on('collect', m => {
      collector.stop('winner');
      m.reply('🏆 Correct! You win!');
    });
    collector.on('end', (collected, reason) => {
      if (reason !== 'winner') {
        channel.send(`⏰ Time's up! The answer was **${a}**.`);
      }
    });
  }
}; 