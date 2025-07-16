const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

function getSequence() {
  let arr = [];
  for (let i = 0; i < 5; i++) arr.push(Math.floor(Math.random() * 9) + 1);
  return arr.join(' ');
}

module.exports = {
  name: 'memory',
  description: 'Memory challenge! Remember the sequence!',
  slashData: new SlashCommandBuilder()
    .setName('memory')
    .setDescription('Memory challenge! Remember the sequence!'),
  async execute(message) {
    const seq = getSequence();
    const embed = new EmbedBuilder()
      .setColor(0x8d6e63)
      .setTitle('🧠 Memory Game!')
      .setDescription(`Memorize this sequence! You have 5 seconds:\n\n**${seq}**`);
    const sent = await message.channel.send({ embeds: [embed] });
    setTimeout(async () => {
      await sent.delete().catch(() => {});
      const askEmbed = new EmbedBuilder()
        .setColor(0x8d6e63)
        .setTitle('🧠 Memory Game!')
        .setDescription('What was the sequence? Type it below!');
      await message.channel.send({ embeds: [askEmbed] });
      const filter = m => m.content.trim() === seq;
      const collector = message.channel.createMessageCollector({ filter, time: 15000 });
      collector.on('collect', m => {
        collector.stop('winner');
        m.reply('🏆 Correct! Amazing memory!');
      });
      collector.on('end', (collected, reason) => {
        if (reason !== 'winner') {
          message.channel.send(`⏰ Time's up! The sequence was: ${seq}`);
        }
      });
    }, 5000);
  },
  async slashExecute(interaction) {
    const seq = getSequence();
    const embed = new EmbedBuilder()
      .setColor(0x8d6e63)
      .setTitle('🧠 Memory Game!')
      .setDescription(`Memorize this sequence! You have 5 seconds:\n\n**${seq}**`);
    const sent = await interaction.reply({ embeds: [embed], fetchReply: true });
    setTimeout(async () => {
      await sent.delete().catch(() => {});
      const askEmbed = new EmbedBuilder()
        .setColor(0x8d6e63)
        .setTitle('🧠 Memory Game!')
        .setDescription('What was the sequence? Type it below!');
      await interaction.channel.send({ embeds: [askEmbed] });
      const filter = m => m.content.trim() === seq;
      const channel = await interaction.channel;
      const collector = channel.createMessageCollector({ filter, time: 15000 });
      collector.on('collect', m => {
        collector.stop('winner');
        m.reply('🏆 Correct! Amazing memory!');
      });
      collector.on('end', (collected, reason) => {
        if (reason !== 'winner') {
          channel.send(`⏰ Time's up! The sequence was: ${seq}`);
        }
      });
    }, 5000);
  }
}; 