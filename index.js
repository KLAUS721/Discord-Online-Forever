const fs = require('fs');
const keepAlive = require('./keep_alive.js');
keepAlive();
const path = require('path');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const config = require('./config.json');
const invitesDataPath = './invites.json';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildInvites
    ],
    partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.User]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// --- Invite Tracker Data ---
function loadInvites() {
    if (!fs.existsSync(invitesDataPath)) return {};
    return JSON.parse(fs.readFileSync(invitesDataPath, 'utf8'));
}
function saveInvites(data) {
    fs.writeFileSync(invitesDataPath, JSON.stringify(data, null, 2));
}
let invitesCache = {};

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    // Cache invites for all guilds
    client.guilds.cache.forEach(async guild => {
        try {
            const invites = await guild.invites.fetch();
            invitesCache[guild.id] = new Map(invites.map(inv => [inv.code, inv.uses]));
        } catch (e) { }
    });
});

client.on('inviteCreate', invite => {
    if (!invitesCache[invite.guild.id]) invitesCache[invite.guild.id] = new Map();
    invitesCache[invite.guild.id].set(invite.code, invite.uses);
});

client.on('inviteDelete', invite => {
    if (invitesCache[invite.guild.id]) invitesCache[invite.guild.id].delete(invite.code);
});

client.on('guildMemberAdd', async member => {
    const guild = member.guild;
    let oldInvites = invitesCache[guild.id] || new Map();
    let newInvites;
    try {
        newInvites = await guild.invites.fetch();
    } catch (e) { return; }
    invitesCache[guild.id] = new Map(newInvites.map(inv => [inv.code, inv.uses]));
    const usedInvite = newInvites.find(inv => (oldInvites.get(inv.code) || 0) < inv.uses);
    let inviter = usedInvite ? usedInvite.inviter : null;
    // Update stats
    let data = loadInvites();
    if (inviter) {
        if (!data[inviter.id]) data[inviter.id] = { real: 0, fake: 0, left: 0, bonus: 0 };
        data[inviter.id].real++;
        saveInvites(data);
    }
    // Send message
    const channel = guild.channels.cache.get('1394995263638339665');
    if (channel && inviter) {
        const stats = data[inviter.id] || { real: 0 };
        channel.send(`<@${member.id}> has been invited by ${inviter} and has now ${stats.real} invites.`);
    }
});

// --- Message Create: Commands + Protection ---
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    // Protection features
    try {
        if (client.commands.has('antilink')) await client.commands.get('antilink').execute(message);
        if (client.commands.has('antispam')) await client.commands.get('antispam').execute(message);
    } catch (e) {}
    // Prefix commands
    const prefix = config.prefix || '!';
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();
    if (!client.commands.has(cmdName)) return;
    try {
        await client.commands.get(cmdName).execute(message, args, 'en');
    } catch (err) {
        message.reply('There was an error executing that command.');
    }
});

client.login(config.token);
