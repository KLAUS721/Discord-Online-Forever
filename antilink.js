const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

function isEnabled() {
  try {
    const data = JSON.parse(fs.readFileSync('./protection.json', 'utf8'));
    return data.antilink;
  } catch {
    return false;
  }
}

module.exports = {
    name: 'antilink',
    async execute(message) {
        if (!isEnabled()) return;
        if (message.author.bot) return;
        const linkRegex = /(https?:\/\/|www\.)[\w\-]+(\.[\w\-]+)+\S*/gi;
        if (linkRegex.test(message.content)) {
            try {
                await message.delete();
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('🚫 روابط غير مسموحة')
                    .setDescription('لا يُسمح بإرسال الروابط في هذا السيرفر.\nLinks are not allowed in this server.')
                    .setFooter({ text: 'AntiLink Protection' });
                await message.channel.send({ embeds: [embed] });
            } catch (err) {
                // تجاهل الأخطاء (مثلاً صلاحيات الحذف)
            }
        }
    },
}; 