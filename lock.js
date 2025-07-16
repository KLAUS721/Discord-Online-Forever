module.exports = {
  name: 'lock',
  description: 'Lock the current channel',
  async execute(message, args, lang) {
    if (!message.member.permissions.has('ManageChannels')) {
      return message.reply(lang === 'ar' ? '❌ ليس لديك صلاحية إدارة القنوات.' : '❌ You do not have permission to manage channels.');
    }
    try {
      await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: false });
      message.reply(lang === 'ar' ? '✅ تم قفل الشات.' : '✅ Channel has been locked.');
    } catch (e) {
      message.reply(lang === 'ar' ? 'حدث خطأ أثناء قفل الشات.' : 'An error occurred while locking the channel.');
    }
  }
}; 