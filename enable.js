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
  name: 'enable',
  description: 'Enable a protection feature in all channels',
  slashData: new SlashCommandBuilder()
    .setName('enable')
    .setDescription('Enable a protection feature in all channels')
    .addStringOption(opt =>
      opt.setName('feature')
        .setDescription('Feature to enable')
        .setRequired(true)
        .addChoices(...features.map(f => ({ name: f, value: f })))
    ),
  async execute(message, args) {
    const feature = (args[0] || '').toLowerCase();
    if (!features.includes(feature)) {
      return message.reply(`Available features: ${features.join(', ')}`);
    }
    setFeature(feature, true);
    const embed = new EmbedBuilder()
      .setColor(0x27ae60)
      .setTitle('✅ Protection Enabled')
      .setDescription(`Feature **${feature}** has been enabled in all channels.`);
    await message.channel.send({ embeds: [embed] });
  },
  async slashExecute(interaction) {
    const feature = interaction.options.getString('feature');
    setFeature(feature, true);
    const embed = new EmbedBuilder()
      .setColor(0x27ae60)
      .setTitle('✅ Protection Enabled')
      .setDescription(`Feature **${feature}** has been enabled in all channels.`);
    await interaction.reply({ embeds: [embed] });
  }
}; 