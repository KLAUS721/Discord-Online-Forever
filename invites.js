const fs = require('fs');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const path = './invites.json';

function loadData() {
  if (!fs.existsSync(path)) return {};
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function saveData(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports = {
  name: 'invites',
  description: 'Show your invite stats',
  slashData: new SlashCommandBuilder()
    .setName('invites')
    .setDescription('Show your invite stats')
    .addUserOption(opt => opt.setName('user').setDescription('User to check').setRequired(false))
    .addStringOption(opt => opt.setName('lang').setDescription('Language: en/ar').setRequired(false)),
  async execute(message, args, lang) {
    const data = loadData();
    let member = message.mentions?.members?.first() || message.member;
    let language = lang || 'en';
    if (args && args[1] && ['ar','en'].includes(args[1])) language = args[1];
    const stats = data[member.id] || { real: 0, fake: 0, left: 0, bonus: 0 };
    const total = stats.real + stats.bonus - stats.left;
    const embed = new EmbedBuilder()
      .setColor(0x00ff99)
      .setTitle(`${member.user.tag}`)
      .setFooter({ text: 'Invite Tracker' })
      .setTimestamp();
    if (language === 'ar') {
      embed.setDescription(`لديك **${total}** دعوة\n(حقيقي: ${stats.real}, خرج: ${stats.left}, مزيف: ${stats.fake}, بونص: ${stats.bonus})`);
    } else {
      embed.setDescription(`You currently have **${total}** invites.\n(${stats.real} regular, ${stats.left} left, ${stats.fake} fake, ${stats.bonus} bonus)`);
    }
    await message.reply({ embeds: [embed] });
  },
  async slashExecute(interaction) {
    const data = loadData();
    const user = interaction.options.getUser('user') || interaction.user;
    const lang = interaction.options.getString('lang') || 'en';
    const stats = data[user.id] || { real: 0, fake: 0, left: 0, bonus: 0 };
    const total = stats.real + stats.bonus - stats.left;
    const embed = new EmbedBuilder()
      .setColor(0x00ff99)
      .setTitle(`${user.tag}`)
      .setFooter({ text: 'Invite Tracker' })
      .setTimestamp();
    if (lang === 'ar') {
      embed.setDescription(`لديك **${total}** دعوة\n(حقيقي: ${stats.real}, خرج: ${stats.left}, مزيف: ${stats.fake}, بونص: ${stats.bonus})`);
    } else {
      embed.setDescription(`You currently have **${total}** invites.\n(${stats.real} regular, ${stats.left} left, ${stats.fake} fake, ${stats.bonus} bonus)`);
    }
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
  loadData,
  saveData
}; 