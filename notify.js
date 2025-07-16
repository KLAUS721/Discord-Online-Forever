module.exports = {
  name: 'notify',
  description: 'تذكيرك برسالة بعد مدة معينة. مثال: !notify 5m رح كل',
  async execute(message, args, lang) {
    if (args.length < 2) {
      return message.reply(lang === 'ar' ? 'يرجى تحديد الوقت والرسالة. مثال: !notify 5m رح كل' : 'Please specify time and message. Ex: !notify 5m eat now');
    }
    const timeArg = args[0];
    const msg = args.slice(1).join(' ');
    let ms = 0;
    if (timeArg.endsWith('m')) ms = parseInt(timeArg) * 60 * 1000;
    else if (timeArg.endsWith('s')) ms = parseInt(timeArg) * 1000;
    else if (timeArg.endsWith('h')) ms = parseInt(timeArg) * 60 * 60 * 1000;
    else ms = parseInt(timeArg) * 1000;
    if (isNaN(ms) || ms <= 0) {
      return message.reply(lang === 'ar' ? 'صيغة الوقت غير صحيحة. استخدم s للثواني، m للدقائق، h للساعات.' : 'Invalid time format. Use s for seconds, m for minutes, h for hours.');
    }
    message.reply(lang === 'ar' ? `سيتم تذكيرك بعد ${timeArg} في الخاص...` : `You will be notified in DM in ${timeArg}...`);
    setTimeout(() => {
      message.author.send(`⏰ ${msg}`).catch(() => {
        message.reply(lang === 'ar' ? 'لا يمكنني إرسال رسالة خاصة لك. تأكد أن الخاص مفتوح.' : 'I cannot send you a DM. Please make sure your DMs are open.');
      });
    }, ms);
  }
}; 