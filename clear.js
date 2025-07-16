module.exports = {
  name: 'clear',
  description: 'Clear a number of messages',
  async execute(message, args, lang) {
    if (!message.member.permissions.has('ManageMessages')) {
      return message.reply(lang === 'ar' ? '❌ ليس لديك صلاحية إدارة الرسائل.' : '❌ You do not have permission to manage messages.');
    }
    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply(lang === 'ar' ? 'يرجى تحديد رقم بين 1 و 100.' : 'Please specify a number between 1 and 100.');
    }
    await message.channel.bulkDelete(amount, true);
    message.channel.send(lang === 'ar' ? `✅ تم مسح ${amount} رسالة.` : `✅ ${amount} messages have been deleted.`)
      .then(msg => setTimeout(() => msg.delete(), 3000));
  }
}; 