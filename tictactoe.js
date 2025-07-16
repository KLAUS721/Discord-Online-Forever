const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const emptyBoard = () => Array(9).fill('⬜');
const winCombos = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6] // diags
];

function checkWin(board, symbol) {
  return winCombos.some(combo => combo.every(i => board[i] === symbol));
}

function renderBoard(board) {
  return `${board.slice(0,3).join(' ')}\n${board.slice(3,6).join(' ')}\n${board.slice(6,9).join(' ')}`;
}

module.exports = {
  name: 'tictactoe',
  description: 'Play Tic Tac Toe with another user!',
  slashData: new SlashCommandBuilder()
    .setName('tictactoe')
    .setDescription('Play Tic Tac Toe with another user!')
    .addUserOption(opt => opt.setName('opponent').setDescription('Your opponent').setRequired(true)),
  async execute(message, args) {
    const opponent = message.mentions.users.first();
    if (!opponent || opponent.bot || opponent.id === message.author.id) {
      return message.reply('Please mention a valid user to play against.');
    }
    await startGame(message.channel, message.author, opponent);
  },
  async slashExecute(interaction) {
    const user1 = interaction.user;
    const user2 = interaction.options.getUser('opponent');
    if (!user2 || user2.bot || user2.id === user1.id) {
      return interaction.reply({ content: 'Please select a valid user to play against.', ephemeral: true });
    }
    await interaction.reply({ content: `Game started between <@${user1.id}> (❌) and <@${user2.id}> (⭕)!`, ephemeral: false });
    await startGame(interaction.channel, user1, user2);
  }
};

async function startGame(channel, user1, user2) {
  let board = emptyBoard();
  let turn = 0;
  let players = [user1, user2];
  let symbols = ['❌', '⭕'];
  let gameOver = false;
  const embed = new EmbedBuilder()
    .setColor(0x2d98da)
    .setTitle('Tic Tac Toe')
    .setDescription(renderBoard(board) + `\n\n<@${players[turn].id}>'s turn (${symbols[turn]})\nType a number (1-9) to place your mark.`);
  let gameMsg = await channel.send({ embeds: [embed] });
  const filter = m => m.author.id === players[turn].id && /^[1-9]$/.test(m.content) && board[parseInt(m.content)-1] === '⬜';
  const collector = channel.createMessageCollector({ filter, time: 60000 });
  collector.on('collect', async m => {
    const idx = parseInt(m.content) - 1;
    board[idx] = symbols[turn];
    if (checkWin(board, symbols[turn])) {
      gameOver = true;
      collector.stop('win');
      await m.reply(`🎉 <@${players[turn].id}> wins!`);
    } else if (board.every(cell => cell !== '⬜')) {
      gameOver = true;
      collector.stop('draw');
      await m.reply('It\'s a draw!');
    } else {
      turn = 1 - turn;
      const updEmbed = EmbedBuilder.from(embed)
        .setDescription(renderBoard(board) + `\n\n<@${players[turn].id}>'s turn (${symbols[turn]})\nType a number (1-9) to place your mark.`);
      await gameMsg.edit({ embeds: [updEmbed] });
    }
  });
  collector.on('end', (collected, reason) => {
    if (!gameOver) {
      channel.send('⏰ Game ended due to inactivity.');
    }
  });
} 