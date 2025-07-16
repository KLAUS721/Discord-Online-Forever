module.exports = {
  name: 'kick',
  description: 'Kick a member from the server',
  async execute(message, args, lang) {
    if (!message.member.permissions.has('KickMembers')) {
      return message.reply(lang === 'ar' ? '❌ ليس لديك صلاحية طرد الأعضاء.' : '❌ You do not have permission to kick members.');
    }
    const member = message.mentions.members.first();
    if (!member) {
      return message.reply(lang === 'ar' ? 'يرجى منشن العضو المراد طرده.' : 'Please mention a member to kick.');
    }
    if (!member.kickable) {
      return message.reply(lang === 'ar' ? 'لا يمكنني طرد هذا العضو.' : 'I cannot kick this member.');
    }
    const reason = args.slice(1).join(' ') || (lang === 'ar' ? 'بدون سبب' : 'No reason');
    await member.kick(reason);
    message.reply(lang === 'ar' ? `✅ تم طرد ${member.user.tag}` : `✅ ${member.user.tag} has been kicked.`);
  }
}; 