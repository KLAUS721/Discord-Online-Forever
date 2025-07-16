module.exports = {
  name: 'mute',
  description: 'Mute a member',
  async execute(message, args, lang) {
    if (!message.member.permissions.has('ModerateMembers')) {
      return message.reply(lang === 'ar' ? '❌ ليس لديك صلاحية إسكات الأعضاء.' : '❌ You do not have permission to mute members.');
    }
    const member = message.mentions.members.first();
    if (!member) {
      return message.reply(lang === 'ar' ? 'يرجى منشن العضو المراد إسكاتُه.' : 'Please mention a member to mute.');
    }
    const duration = args[1] ? parseInt(args[1]) : 10; // دقائق
    try {
      await member.timeout(duration * 60 * 1000);
      message.reply(lang === 'ar' ? `✅ تم إسكات ${member.user.tag} لمدة ${duration} دقيقة.` : `✅ ${member.user.tag} has been muted for ${duration} minutes.`);
    } catch (e) {
      message.reply(lang === 'ar' ? 'حدث خطأ أثناء إسكات العضو.' : 'An error occurred while muting the member.');
    }
  }
}; 