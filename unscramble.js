const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const words = ['discord', 'javascript', 'minigame', 'challenge', 'winner', 'typing', 'server', 'community', 'hangman', 'tictactoe'];

function shuffle(word) {
  return word.split('').sort(() => Math.random() - 0.5).join('');
}

module.exports = {
  name: 'unscramble',
  description: 'Unscramble the word!',
  slashData: new SlashCommandBuilder()
    .setName('unscramble')
    .setDescription('Unscramble the word!'),
  async execute(message) {
    const word = words[Math.floor(Math.random() * words.length)];
    const scrambled = shuffle(word);
    const embed = new EmbedBuilder()
      .setColor(0x1abc9c)
      .setTitle('🔤 Word Unscramble!')
      .setDescription(`Unscramble the following word:\n\n**${scrambled}**`);
    await message.channel.send({ embeds: [embed] });
    const filter = m => m.content.toLowerCase() === word;
    const collector = message.channel.createMessageCollector({ filter, time: 20000 });
    collector.on('collect', m => {
      collector.stop('winner');
      m.reply('🏆 Correct! You win!');
    });
    collector.on('end', (collected, reason) => {
      if (reason !== 'winner') {
        message.channel.send(`⏰ Time's up! The word was **${word}**.`);
      }
    });
  },
  async slashExecute(interaction) {
    const word = words[Math.floor(Math.random() * words.length)];
    const scrambled = shuffle(word);
    const embed = new EmbedBuilder()
      .setColor(0x1abc9c)
      .setTitle('🔤 Word Unscramble!')
      .setDescription(`Unscramble the following word:\n\n**${scrambled}**`);
    await interaction.reply({ embeds: [embed] });
    const filter = m => m.content.toLowerCase() === word;
    const channel = await interaction.channel;
    const collector = channel.createMessageCollector({ filter, time: 20000 });
    collector.on('collect', m => {
      collector.stop('winner');
      m.reply('🏆 Correct! You win!');
    });
    collector.on('end', (collected, reason) => {
      if (reason !== 'winner') {
        channel.send(`⏰ Time's up! The word was **${word}**.`);
      }
    });
  }
}; 