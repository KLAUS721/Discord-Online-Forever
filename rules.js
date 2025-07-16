const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const rulesEmbed = new EmbedBuilder()
  .setColor(0x5865F2)
  .setTitle('📜 Discord Server Rules | قوانين السيرفر')
  .setDescription(
    `**English:**\n
1. Be respectful to everyone. No harassment, hate speech, or personal attacks.\n2. Use appropriate language. No swearing or offensive content.\n3. No spamming, trolling, or flooding channels.\n4. Do not share personal information or private messages.\n5. No advertising or server invites without permission.\n6. Use channels for their intended purpose.\n7. Follow staff instructions at all times.\n8. Usernames and avatars must be appropriate.\n9. No NSFW or illegal content.\n10. Staff may remove any content or member at their discretion.\n\n**By participating, you agree to follow all rules. Violations may result in warnings, mutes, kicks, or bans.**\n\n---\n\n**العربية:**\n
١. الاحترام واجب للجميع. يُمنع الإساءة أو خطاب الكراهية أو الهجوم الشخصي.\n٢. استخدم لغة مناسبة. يُمنع السب أو المحتوى غير اللائق.\n٣. يُمنع السبام أو التكرار أو إغراق القنوات بالرسائل.\n٤. لا تشارك معلوماتك أو رسائل خاصة مع الآخرين.\n٥. يُمنع الإعلان أو نشر روابط سيرفرات بدون إذن الإدارة.\n٦. استخدم كل قناة لما خُصصت له فقط.\n٧. يجب اتباع تعليمات الإدارة دائمًا.\n٨. يجب أن يكون اسم المستخدم وصورة الحساب لائقين.\n٩. يُمنع أي محتوى غير لائق أو مخالف للقوانين أو NSFW.\n١٠. يحق للإدارة حذف أي محتوى أو طرد أي عضو حسب تقديرهم.\n\n**بمجرد مشاركتك، أنت توافق على جميع القوانين. المخالفات قد تؤدي إلى تحذير أو كتم أو طرد أو حظر.**`
  )
  .setFooter({ text: 'Discord Server Rules | قوانين السيرفر' });

module.exports = {
  name: 'rules',
  description: 'Show the server rules in Arabic and English',
  slashData: new SlashCommandBuilder()
    .setName('rules')
    .setDescription('Show the server rules in Arabic and English'),
  async execute(message) {
    await message.channel.send({ embeds: [rulesEmbed] });
  },
  async slashExecute(interaction) {
    await interaction.reply({ embeds: [rulesEmbed], ephemeral: false });
  }
}; 