const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const emojis = ['😀','😂','😎','😍','🤔','😱','🥳','😡','😴','🤖'];

function getSequence() {
  let arr = [];
  for (let i = 0; i < 4; i++) arr.push(emojis[Math.floor(Math.random() * emojis.length)]);
  return arr.join(' ');
}

module.exports = {
  name: 'emojimatch',
  description: 'Type the emoji sequence as fast as you can!',
  slashData: new SlashCommandBuilder()
    .setName('emojimatch')
    .setDescription('Type the emoji sequence as fast as you can!'),
  async execute(message) {
    const seq = getSequence();
    const embed = new EmbedBuilder()
      .setColor(0xffc300)
      .setTitle('😀 Emoji Match!')
      .setDescription(`Type the following emoji sequence as fast as you can:\n\n${seq}`);
    await message.channel.send({ embeds: [embed] });
    const filter = m => m.content.trim() === seq;
    const collector = message.channel.createMessageCollector({ filter, time: 20000 });
    collector.on('collect', m => {
      collector.stop('winner');
      m.reply('🏆 Correct! You win!');
    });
    collector.on('end', (collected, reason) => {
      if (reason !== 'winner') {
        message.channel.send(`⏰ Time's up! The sequence was: ${seq}`);
      }
    });
  },
  async slashExecute(interaction) {
    const seq = getSequence();
    const embed = new EmbedBuilder()
      .setColor(0xffc300)
      .setTitle('😀 Emoji Match!')
      .setDescription(`Type the following emoji sequence as fast as you can:\n\n${seq}`);
    await interaction.reply({ embeds: [embed] });
    const filter = m => m.content.trim() === seq;
    const channel = await interaction.channel;
    const collector = channel.createMessageCollector({ filter, time: 20000 });
    collector.on('collect', m => {
      collector.stop('winner');
      m.reply('🏆 Correct! You win!');
    });
    collector.on('end', (collected, reason) => {
      if (reason !== 'winner') {
        channel.send(`⏰ Time's up! The sequence was: ${seq}`);
      }
    });
  }
}; 