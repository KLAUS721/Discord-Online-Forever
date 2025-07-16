const { REST, Routes } = require('discord.js');
const config = require('./config.json');
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.slashData) {
    commands.push(command.slashData.toJSON());
  }
}

const rest = new REST({ version: '10' }).setToken(config.token);
const guilds = ['1391151887159529492', '1394389022285234186'];

(async () => {
  try {
    for (const guildId of guilds) {
      console.log(`Registering commands for guild: ${guildId}`);
      await rest.put(
        Routes.applicationGuildCommands(config.client_id, guildId),
        { body: commands },
      );
    }
    console.log('Successfully reloaded application (/) commands for all guilds.');
  } catch (error) {
    console.error(error);
  }
})(); 