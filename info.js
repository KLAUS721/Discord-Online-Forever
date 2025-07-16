const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'info',
  description: 'Show all bot commands with their descriptions',
  slashData: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Show all bot commands with their descriptions'),
  async execute(message) {
    const commandsPath = path.join(__dirname);
    const files = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
    let fields = [];
    for (const file of files) {
      try {
        const cmd = require(path.join(commandsPath, file));
        if (cmd.name && cmd.description) {
          fields.push({ name: `/${cmd.name}  |  !${cmd.name}`, value: cmd.description });
        }
      } catch {}
    }
    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle('🤖 Bot Commands Info')
      .setDescription('Here is a list of all available commands and their descriptions:')
      .addFields(fields)
      .setFooter({ text: 'Bot Info' });
    await message.channel.send({ embeds: [embed] });
  },
  async slashExecute(interaction) {
    const commandsPath = __dirname;
    const files = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
    let fields = [];
    for (const file of files) {
      try {
        const cmd = require(path.join(commandsPath, file));
        if (cmd.name && cmd.description) {
          fields.push({ name: `/${cmd.name}  |  !${cmd.name}`, value: cmd.description });
        }
      } catch {}
    }
    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle('🤖 Bot Commands Info')
      .setDescription('Here is a list of all available commands and their descriptions:')
      .addFields(fields)
      .setFooter({ text: 'Bot Info' });
    await interaction.reply({ embeds: [embed], ephemeral: false });
  }
}; 