const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

function isEnabled() {
  try {
    const data = JSON.parse(fs.readFileSync('./protection.json', 'utf8'));
    return data.antiwebhook;
  } catch {
    return false;
  }
}

module.exports = {
  name: 'antiwebhook',
  async webhookUpdate(channel) {
    if (!isEnabled()) return;
    try {
      const webhooks = await channel.fetchWebhooks();
      for (const [id, webhook] of webhooks) {
        // يمكنك تخصيص قائمة webhooks المسموح بها هنا
        await webhook.delete('Anti-Webhook Protection: Unauthorized webhook');
        const logChannel = channel.guild.channels.cache.get('1395040213352579153');
        if (logChannel) {
          const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('🪝 Unauthorized Webhook Deleted')
            .setDescription(`A webhook was deleted in <#${channel.id}>.`)
            .setFooter({ text: 'AntiWebhook Protection' });
          logChannel.send({ embeds: [embed] });
        }
      }
    } catch {}
  }
}; 