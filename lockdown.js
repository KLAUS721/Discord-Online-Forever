const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

function isEnabled() {
  try {
    const data = JSON.parse(fs.readFileSync('./protection.json', 'utf8'));
    return data.lockdown;
  } catch {
    return false;
  }
}

module.exports = {
  name: 'lockdown',
  description: 'Lock all text channels in the server',
  slashData: new SlashCommandBuilder()
    .setName('lockdown')
    .setDescription('Lock all text channels in the server'),
  async execute(message) {
    if (!isEnabled()) return message.reply('Lockdown is not enabled.');
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return message.reply('You need admin permissions.');
    const channels = message.guild.channels.cache.filter(c => c.isTextBased());
    for (const [id, channel] of channels) {
      await channel.permissionOverwrites.edit(message.guild.id, { SendMessages: false }).catch(() => {});
    }
    const embed = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle('🔒 Server Lockdown')
      .setDescription('All text channels have been locked.');
    await message.channel.send({ embeds: [embed] });
  },
  async slashExecute(interaction) {
    if (!isEnabled()) return interaction.reply({ content: 'Lockdown is not enabled.', ephemeral: true });
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: 'You need admin permissions.', ephemeral: true });
    const channels = interaction.guild.channels.cache.filter(c => c.isTextBased());
    for (const [id, channel] of channels) {
      await channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: false }).catch(() => {});
    }
    const embed = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle('🔒 Server Lockdown')
      .setDescription('All text channels have been locked.');
    await interaction.reply({ embeds: [embed] });
  }
}; 