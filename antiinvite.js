const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

function isEnabled() {
  try {
    const data = JSON.parse(fs.readFileSync('./protection.json', 'utf8'));
    return data.antiinvite;
  } catch {
    return false;
  }
}

module.exports = {
    name: 'antiinvite',
    async execute(message) {
        if (!isEnabled()) return;
        if (message.author.bot) return;
        const inviteRegex = /(discord\.gg\/|discordapp\.com\/invite\/|discord\.com\/invite\/)/gi;
        if (inviteRegex.test(message.content)) {
            try {
                await message.delete();
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('🚫 دعوات غير مسموحة')
                    .setDescription('لا يُسمح بنشر دعوات السيرفرات هنا.\nServer invites are not allowed here.')
                    .setFooter({ text: 'AntiInvite Protection' });
                await message.channel.send({ embeds: [embed] });
            } catch (err) {
                // تجاهل الأخطاء (مثلاً صلاحيات الحذف)
            }
        }
    },
}; 