const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

const MAX_MENTIONS = 4; // الحد الأقصى للمنشنات في الرسالة

function isEnabled() {
  try {
    const data = JSON.parse(fs.readFileSync('./protection.json', 'utf8'));
    return data.antimention;
  } catch {
    return false;
  }
}

module.exports = {
    name: 'antimention',
    async execute(message) {
        if (!isEnabled()) return;
        if (message.author.bot) return;
        const mentionCount = (message.content.match(/<@!?\d+>/g) || []).length;
        if (mentionCount > MAX_MENTIONS) {
            try {
                await message.delete();
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('🚫 Mentions Limit Exceeded')
                    .setDescription(`You cannot mention more than ${MAX_MENTIONS} users in a single message.\nلا يمكنك منشن أكثر من ${MAX_MENTIONS} أشخاص في رسالة واحدة.`)
                    .setFooter({ text: 'AntiMention Protection' });
                await message.channel.send({ embeds: [embed] });
            } catch (err) {
                // تجاهل الأخطاء (مثلاً صلاحيات الحذف)
            }
        }
    },
}; 