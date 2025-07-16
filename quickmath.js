const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

function getQuestion() {
  const a = Math.floor(Math.random() * 20) + 1;
  const b = Math.floor(Math.random() * 20) + 1;
  const ops = ['+', '-', '*'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let answer;
  if (op === '+') answer = a + b;
  if (op === '-') answer = a - b;
  if (op === '*') answer = a * b;
  return { q: `${a} ${op} ${b}`, a: answer };
}

module.exports = {
  name: 'quickmath',
  description: 'Solve a quick math problem!',
  slashData: new SlashCommandBuilder()
    .setName('quickmath')
    .setDescription('Solve a quick math problem!'),
  async execute(message) {
    const { q, a } = getQuestion();
    const embed = new EmbedBuilder()
      .setColor(0xf1c40f)
      .setTitle('🧮 Quick Math!')
      .setDescription(`First to answer correctly wins!\n\n**${q} = ?**`);
    await message.channel.send({ embeds: [embed] });
    const filter = m => m.content === a.toString();
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
    const { q, a } = getQuestion();
    const embed = new EmbedBuilder()
      .setColor(0xf1c40f)
      .setTitle('🧮 Quick Math!')
      .setDescription(`First to answer correctly wins!\n\n**${q} = ?**`);
    await interaction.reply({ embeds: [embed] });
    const filter = m => m.content === a.toString();
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