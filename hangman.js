const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const words = ['discord', 'javascript', 'hangman', 'minigame', 'challenge', 'community', 'typing', 'winner', 'server', 'bot'];
const maxAttempts = 6;

function getDisplay(word, guessed) {
  return word.split('').map(l => (guessed.includes(l) ? l : '_')).join(' ');
}

module.exports = {
  name: 'hangman',
  description: 'Play Hangman! Guess the word letter by letter.',
  slashData: new SlashCommandBuilder()
    .setName('hangman')
    .setDescription('Play Hangman! Guess the word letter by letter.'),
  async execute(message) {
    const word = words[Math.floor(Math.random() * words.length)];
    let guessed = [];
    let attempts = 0;
    let display = getDisplay(word, guessed);
    const embed = new EmbedBuilder()
      .setColor(0x34495e)
      .setTitle('🎩 Hangman!')
      .setDescription(`Word: ${display}\nWrong guesses: ${attempts}/${maxAttempts}\nType a single letter to guess!`);
    const gameMsg = await message.channel.send({ embeds: [embed] });
    const filter = m => m.author.id === message.author.id && /^[a-zA-Z]$/.test(m.content);
    const collector = message.channel.createMessageCollector({ filter, time: 60000 });
    collector.on('collect', m => {
      const letter = m.content.toLowerCase();
      if (guessed.includes(letter)) {
        m.reply('You already guessed that letter!');
        return;
      }
      if (word.includes(letter)) {
        guessed.push(letter);
        display = getDisplay(word, guessed);
        if (!display.includes('_')) {
          collector.stop('win');
          m.reply(`🎉 Correct! The word was **${word}**. You win!`);
        }
      } else {
        attempts++;
        guessed.push(letter);
        if (attempts >= maxAttempts) {
          collector.stop('lose');
          m.reply(`❌ Out of attempts! The word was **${word}**.`);
        }
      }
      const updEmbed = EmbedBuilder.from(embed)
        .setDescription(`Word: ${getDisplay(word, guessed)}\nWrong guesses: ${attempts}/${maxAttempts}\nType a single letter to guess!`);
      gameMsg.edit({ embeds: [updEmbed] });
    });
    collector.on('end', (collected, reason) => {
      if (reason !== 'win' && reason !== 'lose') {
        message.channel.send(`⏰ Time's up! The word was **${word}**.`);
      }
    });
  },
  async slashExecute(interaction) {
    const word = words[Math.floor(Math.random() * words.length)];
    let guessed = [];
    let attempts = 0;
    let display = getDisplay(word, guessed);
    const embed = new EmbedBuilder()
      .setColor(0x34495e)
      .setTitle('🎩 Hangman!')
      .setDescription(`Word: ${display}\nWrong guesses: ${attempts}/${maxAttempts}\nType a single letter to guess!`);
    const gameMsg = await interaction.reply({ embeds: [embed], fetchReply: true });
    const filter = m => m.author.id === interaction.user.id && /^[a-zA-Z]$/.test(m.content);
    const channel = await interaction.channel;
    const collector = channel.createMessageCollector({ filter, time: 60000 });
    collector.on('collect', m => {
      const letter = m.content.toLowerCase();
      if (guessed.includes(letter)) {
        m.reply('You already guessed that letter!');
        return;
      }
      if (word.includes(letter)) {
        guessed.push(letter);
        display = getDisplay(word, guessed);
        if (!display.includes('_')) {
          collector.stop('win');
          m.reply(`🎉 Correct! The word was **${word}**. You win!`);
        }
      } else {
        attempts++;
        guessed.push(letter);
        if (attempts >= maxAttempts) {
          collector.stop('lose');
          m.reply(`❌ Out of attempts! The word was **${word}**.`);
        }
      }
      const updEmbed = EmbedBuilder.from(embed)
        .setDescription(`Word: ${getDisplay(word, guessed)}\nWrong guesses: ${attempts}/${maxAttempts}\nType a single letter to guess!`);
      gameMsg.edit({ embeds: [updEmbed] });
    });
    collector.on('end', (collected, reason) => {
      if (reason !== 'win' && reason !== 'lose') {
        channel.send(`⏰ Time's up! The word was **${word}**.`);
      }
    });
  }
}; 