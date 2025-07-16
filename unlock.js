module.exports = {
  name: 'unlock',
  description: 'Unlock the current channel',
  async execute(message, args, lang) {
    if (!message.member.permissions.has('ManageChannels')) {
      return message.reply(lang === 'ar' ? '❌ ليس لديك صلاحية إدارة القنوات.' : '❌ You do not have permission to manage channels.');
    }
    try {
      await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: true });
      message.reply(lang === 'ar' ? '✅ تم فتح الشات.' : '✅ Channel has been unlocked.');
    } catch (e) {
      message.reply(lang === 'ar' ? 'حدث خطأ أثناء فتح الشات.' : 'An error occurred while unlocking the channel.');
    }
  }
}; 