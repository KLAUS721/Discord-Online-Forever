const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'ping',
  description: 'Bot ping',
  slashData: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Bot ping'),
  async execute(message, args, lang) {
    const embed = new EmbedBuilder()
      .setColor(0x00ff99)
      .setTitle(lang === 'ar' ? '🏓 بنج البوت' : '🏓 Bot Ping')
      .setDescription(lang === 'ar' ? 'البوت يعمل بنجاح!' : 'Bot is working!');
    await message.reply({ embeds: [embed] });
  },
  async slashExecute(interaction) {
    const lang = interaction.options.getString('lang') || 'en';
    const embed = new EmbedBuilder()
      .setColor(0x00ff99)
      .setTitle(lang === 'ar' ? '🏓 بنج البوت' : '🏓 Bot Ping')
      .setDescription(lang === 'ar' ? 'البوت يعمل بنجاح!' : 'Bot is working!');
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
}; 