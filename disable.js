const fs = require('fs');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const features = ['antilink', 'antispam', 'antiinvite', 'antimention'];

function setFeature(feature, value) {
  const path = './protection.json';
  let data = {};
  if (fs.existsSync(path)) data = JSON.parse(fs.readFileSync(path, 'utf8'));
  data[feature] = value;
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports = {
  name: 'disable',
  description: 'Disable a protection feature in all channels',
  slashData: new SlashCommandBuilder()
    .setName('disable')
    .setDescription('Disable a protection feature in all channels')
    .addStringOption(opt =>
      opt.setName('feature')
        .setDescription('Feature to disable')
        .setRequired(true)
        .addChoices(...features.map(f => ({ name: f, value: f })))
    ),
  async execute(message, args) {
    const feature = (args[0] || '').toLowerCase();
    if (!features.includes(feature)) {
      return message.reply(`Available features: ${features.join(', ')}`);
    }
    setFeature(feature, false);
    const embed = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle('❌ Protection Disabled')
      .setDescription(`Feature **${feature}** has been disabled in all channels.`);
    await message.channel.send({ embeds: [embed] });
  },
  async slashExecute(interaction) {
    const feature = interaction.options.getString('feature');
    setFeature(feature, false);
    const embed = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle('❌ Protection Disabled')
      .setDescription(`Feature **${feature}** has been disabled in all channels.`);
    await interaction.reply({ embeds: [embed] });
  }
}; 