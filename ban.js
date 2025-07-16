const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Ban a member',
  slashData: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member')
    .addUserOption(opt => opt.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason').setRequired(false))
    .addStringOption(opt => opt.setName('lang').setDescription('Language: en/ar').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(message, args, lang) {
    if (!message.member.permissions.has('BanMembers')) {
      return message.reply(lang === 'ar' ? '❌ ليس لديك صلاحية حظر الأعضاء.' : '❌ You do not have permission to ban members.');
    }
    const member = message.mentions.members.first();
    if (!member) {
      return message.reply(lang === 'ar' ? 'يرجى منشن العضو المراد حظره.' : 'Please mention a member to ban.');
    }
    if (!member.bannable) {
      return message.reply(lang === 'ar' ? 'لا يمكنني حظر هذا العضو.' : 'I cannot ban this member.');
    }
    const reason = args.slice(1).join(' ') || (lang === 'ar' ? 'بدون سبب' : 'No reason');
    await member.ban({ reason });
    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle(lang === 'ar' ? '🚫 تم الحظر' : '🚫 Banned')
      .setDescription(lang === 'ar' ? `تم حظر ${member.user.tag}` : `${member.user.tag} has been banned.`)
      .addFields({ name: lang === 'ar' ? 'السبب' : 'Reason', value: reason });
    await message.reply({ embeds: [embed] });
  },
  async slashExecute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason';
    const lang = interaction.options.getString('lang') || 'en';
    const member = await interaction.guild.members.fetch(user.id);
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({ content: lang === 'ar' ? '❌ ليس لديك صلاحية حظر الأعضاء.' : '❌ You do not have permission to ban members.', ephemeral: true });
    }
    if (!member.bannable) {
      return interaction.reply({ content: lang === 'ar' ? 'لا يمكنني حظر هذا العضو.' : 'I cannot ban this member.', ephemeral: true });
    }
    await member.ban({ reason });
    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle(lang === 'ar' ? '🚫 تم الحظر' : '🚫 Banned')
      .setDescription(lang === 'ar' ? `تم حظر ${user.tag}` : `${user.tag} has been banned.`)
      .addFields({ name: lang === 'ar' ? 'السبب' : 'Reason', value: reason });
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
}; 