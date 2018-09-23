// Require discord.js, fs, and the config file
const Discord = require('discord.js');
const fs = require('fs');
const { prefix, token, ownerID } = require('./config.json');

// Creates a new instance of the Discord Client
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Logs Gyromina into the console, once the client is ready
// Will trigger once login is complete or Gyromina reconnects after disconnection
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}, ready for action!`);
  client.user.setActivity(`${prefix}help / Playing ping-pong with Discord!`);

  // Temporary status for testing phase
  client.user.setStatus("idle");
  // Use this status after testing phase
  //client.user.setStatus("online");
});

client.on('message', message => {

  // Filters out messages not beginning with Gyromina's prefix and messages sent by bots.
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  try {
      command.execute(message, args);
  }
  catch (error) {
      console.error(error);
      message.reply('uh oh... looks like *something* went wrong...');
  }
});

// Logs into Discord with Gyromina's token
client.login(token);
