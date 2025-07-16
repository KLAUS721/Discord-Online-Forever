const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

const JOIN_LIMIT = 5; // الحد الأقصى لدخول الأعضاء خلال الفترة
const TIME_FRAME = 15000; // 15 ثانية
let joinTimestamps = [];

function isEnabled() {
  try {
    const data = JSON.parse(fs.readFileSync('./protection.json', 'utf8'));
    return data.antimassjoin;
  } catch {
    return false;
  }
}

module.exports = {
  name: 'antimassjoin',
  async guildMemberAdd(member) {
    if (!isEnabled()) return;
    const now = Date.now();
    joinTimestamps.push(now);
    joinTimestamps = joinTimestamps.filter(ts => now - ts < TIME_FRAME);
    if (joinTimestamps.length > JOIN_LIMIT) {
      const logChannel = member.guild.channels.cache.get('1395040213352579153');
      if (logChannel) {
        const embed = new EmbedBuilder()
          .setColor(0xFF0000)
          .setTitle('🚨 Mass Join Detected')
          .setDescription(`More than ${JOIN_LIMIT} members joined in ${TIME_FRAME/1000} seconds! Possible raid.`)
          .setFooter({ text: 'AntiMassJoin Protection' });
        logChannel.send({ embeds: [embed] });
      }
    }
  }
}; 