const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

const ALLOWED_BOTS = []; // ضع هنا ID البوتات المسموح بها

function isEnabled() {
  try {
    const data = JSON.parse(fs.readFileSync('./protection.json', 'utf8'));
    return data.antibot;
  } catch {
    return false;
  }
}

module.exports = {
  name: 'antibot',
  async guildMemberAdd(member) {
    if (!isEnabled()) return;
    if (member.user.bot && !ALLOWED_BOTS.includes(member.id)) {
      try {
        await member.kick('Anti-Bot Protection: Unauthorized bot');
        const logChannel = member.guild.channels.cache.get('1395040213352579153');
        if (logChannel) {
          const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('🤖 Unauthorized Bot Kicked')
            .setDescription(`Bot <@${member.id}> was kicked automatically.`)
            .setFooter({ text: 'AntiBot Protection' });
          logChannel.send({ embeds: [embed] });
        }
      } catch {}
    }
  }
}; 