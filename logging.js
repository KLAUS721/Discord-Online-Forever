const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

function isEnabled() {
  try {
    const data = JSON.parse(fs.readFileSync('./protection.json', 'utf8'));
    return data.logging;
  } catch {
    return false;
  }
}

const LOG_CHANNEL_ID = '1395040213352579153';

module.exports = {
  name: 'logging',
  async messageDelete(message) {
    if (!isEnabled()) return;
    if (!message.guild) return;
    const logChannel = message.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (logChannel) {
      const embed = new EmbedBuilder()
        .setColor(0xe67e22)
        .setTitle('🗑️ Message Deleted')
        .setDescription(`Message by <@${message.author?.id}> deleted in <#${message.channel.id}>\nContent: \
${message.content}`)
        .setFooter({ text: 'Logging' });
      logChannel.send({ embeds: [embed] });
    }
  },
  async messageUpdate(oldMsg, newMsg) {
    if (!isEnabled()) return;
    if (!oldMsg.guild) return;
    const logChannel = oldMsg.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (logChannel) {
      const embed = new EmbedBuilder()
        .setColor(0xf1c40f)
        .setTitle('✏️ Message Edited')
        .setDescription(`Message by <@${oldMsg.author?.id}> edited in <#${oldMsg.channel.id}>\n**Before:** ${oldMsg.content}\n**After:** ${newMsg.content}`)
        .setFooter({ text: 'Logging' });
      logChannel.send({ embeds: [embed] });
    }
  },
  async channelDelete(channel) {
    if (!isEnabled()) return;
    const logChannel = channel.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (logChannel) {
      const embed = new EmbedBuilder()
        .setColor(0xe74c3c)
        .setTitle('📛 Channel Deleted')
        .setDescription(`Channel **${channel.name}** was deleted.`)
        .setFooter({ text: 'Logging' });
      logChannel.send({ embeds: [embed] });
    }
  },
  async roleDelete(role) {
    if (!isEnabled()) return;
    const logChannel = role.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (logChannel) {
      const embed = new EmbedBuilder()
        .setColor(0xe74c3c)
        .setTitle('🛑 Role Deleted')
        .setDescription(`Role **${role.name}** was deleted.`)
        .setFooter({ text: 'Logging' });
      logChannel.send({ embeds: [embed] });
    }
  }
}; 