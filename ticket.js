const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, PermissionFlagsBits, Events } = require('discord.js');

// إعدادات النظام
const TICKETS_CATEGORY_ID = '1395003858480267364';
const TICKETS_CHANNEL_ID = '1391153153306656808';
const ADMIN_ROLES = ['1391466374295191693', '1391465458628165772'];

// نص رسالة القوانين
const rulesEmbed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle('🎫 Need Help? Open a Support Ticket!')
    .setDescription(`Welcome to the support center. Please read the following rules before opening a ticket:\n\n1. **Describe your issue clearly:** Provide as much detail as possible to help us assist you quickly.\n2. **One ticket per issue:** Do not open multiple tickets for the same problem.\n3. **Be respectful:** Abusive language or spam will result in your ticket being closed and may lead to further action.\n4. **No unnecessary pings:** Please do not mention staff unless absolutely necessary.\n5. **Patience is appreciated:** Our team will respond as soon as possible. Repeatedly asking for updates will not speed up the process.\n\nIf you agree to these rules and need assistance, click the button below to open a ticket.\nThank you for helping us keep support organized and efficient!`)
    .setFooter({ text: 'Support System' });

const openTicketBtn = new ButtonBuilder()
    .setCustomId('open_ticket')
    .setLabel('Open Ticket')
    .setStyle(ButtonStyle.Primary)
    .setEmoji('🎫');

const closeTicketBtn = new ButtonBuilder()
    .setCustomId('close_ticket')
    .setLabel('Close Ticket')
    .setStyle(ButtonStyle.Danger)
    .setEmoji('🔒');

const ratingRow = new ActionRowBuilder().addComponents(
    ...[1,2,3,4,5].map(n => new ButtonBuilder()
        .setCustomId(`rate_${n}`)
        .setLabel('⭐'.repeat(n))
        .setStyle(ButtonStyle.Secondary))
);

// حماية من سبام التكتات
const userTickets = new Map();

module.exports = {
    name: 'ticket',
    description: 'Send the ticket panel',
    async execute(message) {
        if (message.channel.id !== TICKETS_CHANNEL_ID) return message.reply('This command can only be used in the tickets channel.');
        // إرسال رسالة البانل
        await message.channel.send({ embeds: [rulesEmbed], components: [new ActionRowBuilder().addComponents(openTicketBtn)] });
        await message.reply('Ticket panel sent!');
    },
    async interactionCreate(interaction) {
        // فتح تذكرة
        if (interaction.isButton() && interaction.customId === 'open_ticket') {
            // حماية من سبام التكتات
            if (userTickets.get(interaction.user.id)) {
                return interaction.reply({ content: 'You already have an open ticket.', ephemeral: true });
            }
            // إنشاء قناة التذكرة
            const guild = interaction.guild;
            const ticketChannel = await guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: TICKETS_CATEGORY_ID,
                permissionOverwrites: [
                    { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                    { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ReadMessageHistory] },
                    ...ADMIN_ROLES.map(rid => ({ id: rid, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] }))
                ]
            });
            userTickets.set(interaction.user.id, ticketChannel.id);
            // رسالة ترحيب داخل التذكرة
            const welcomeEmbed = new EmbedBuilder()
                .setColor(0x00B86B)
                .setTitle('Welcome to your support ticket!')
                .setDescription('Our team will be with you shortly. Please describe your issue in detail.\n\nTo close this ticket, press the button below.');
            await ticketChannel.send({ content: `<@${interaction.user.id}>`, embeds: [welcomeEmbed], components: [new ActionRowBuilder().addComponents(closeTicketBtn)] });
            await interaction.reply({ content: `Your ticket has been created: ${ticketChannel}`, ephemeral: true });
        }
        // إغلاق التذكرة
        if (interaction.isButton() && interaction.customId === 'close_ticket') {
            const channel = interaction.channel;
            // رسالة تقييم
            const rateEmbed = new EmbedBuilder()
                .setColor(0xFFD700)
                .setTitle('Rate Our Support')
                .setDescription('Please rate your support experience by clicking the stars below:');
            await channel.send({ embeds: [rateEmbed], components: [ratingRow] });
            await interaction.reply({ content: 'Ticket will be closed in 10 seconds. Thank you!', ephemeral: true });
            setTimeout(() => {
                channel.delete().catch(() => {});
                // إزالة من سبام التكتات
                for (const [uid, cid] of userTickets.entries()) {
                    if (cid === channel.id) userTickets.delete(uid);
                }
            }, 10000);
        }
        // تقييم النجوم
        if (interaction.isButton() && interaction.customId.startsWith('rate_')) {
            const stars = interaction.customId.split('_')[1];
            await interaction.reply({ content: `Thank you for rating us ${'⭐'.repeat(stars)}!`, ephemeral: true });
        }
    }
}; 