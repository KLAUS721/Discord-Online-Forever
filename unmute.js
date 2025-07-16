module.exports = {
  name: 'unmute',
  description: 'Unmute a member',
  async execute(message, args, lang) {
    if (!message.member.permissions.has('ModerateMembers')) {
      return message.reply(lang === 'ar' ? '❌ ليس لديك صلاحية إلغاء إسكات الأعضاء.' : '❌ You do not have permission to unmute members.');
    }
    const member = message.mentions.members.first();
    if (!member) {
      return message.reply(lang === 'ar' ? 'يرجى منشن العضو المراد إلغاء إسكاتُه.' : 'Please mention a member to unmute.');
    }
    try {
      await member.timeout(null);
      message.reply(lang === 'ar' ? `✅ تم إلغاء إسكات ${member.user.tag}.` : `✅ ${member.user.tag} has been unmuted.`);
    } catch (e) {
      message.reply(lang === 'ar' ? 'حدث خطأ أثناء إلغاء إسكات العضو.' : 'An error occurred while unmuting the member.');
    }
  }
}; 