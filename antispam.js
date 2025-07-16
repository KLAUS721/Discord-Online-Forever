const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

function isEnabled() {
  try {
    const data = JSON.parse(fs.readFileSync('./protection.json', 'utf8'));
    return data.antispam;
  } catch {
    return false;
  }
}

const userMessages = new Map();
const SPAM_LIMIT = 5; // عدد الرسائل المسموح خلال الفترة
const TIME_FRAME = 7000; // بالمللي ثانية (7 ثواني)

module.exports = {
    name: 'antispam',
    async execute(message) {
        if (!isEnabled()) return;
        if (message.author.bot) return;
        const now = Date.now();
        const userId = message.author.id;
        if (!userMessages.has(userId)) {
            userMessages.set(userId, []);
        }
        const timestamps = userMessages.get(userId);
        timestamps.push(now);
        // حذف الرسائل القديمة خارج الفترة الزمنية
        while (timestamps.length && now - timestamps[0] > TIME_FRAME) {
            timestamps.shift();
        }
        if (timestamps.length > SPAM_LIMIT) {
            try {
                await message.delete();
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('🚫 سبام غير مسموح')
                    .setDescription('يرجى عدم تكرار الرسائل بسرعة.\nPlease do not spam messages.')
                    .setFooter({ text: 'AntiSpam Protection' });
                await message.channel.send({ embeds: [embed] });
            } catch (err) {
                // تجاهل الأخطاء (مثلاً صلاحيات الحذف)
            }
        }
    },
}; 