// Require discord.js and the refcode generator
const Discord = require('discord.js');
const e = require('../systemFiles/emojis.json');

function setParams(c) {
  var list = "\• " + process.env.prefix + "**" + c.help.name + "**"
  // Checks for parameters, and adds them as necessary
  if(!c.help.params) {
    list += "\n";
  } else if(Array.isArray(c.help.params) == false) {
    list += ` ${c.help.params}\n`;
  } else {
    list += ` ${c.help.params[0]}\n`;
    for(let i = 1; i < c.help.params.length; i++) {list += `or ${process.env.prefix}**${c.help.name}** ${c.help.params[i]}\n`;}
  }
  return list;
}

function setGameOptions(g) {
  var list = "\• **" + g.label.name + "**"
  // Checks for parameters, and adds them as necessary
  if(!g.label.options) {
    list += "\n";
  } else if(Array.isArray(g.label.options) == false) {
    list += ` ${g.label.options}\n`;
  } else {
    list += ` ${g.label.options[0]}\n`;
    for(let i = 1; i < g.label.options.length; i++) {list += `or **${g.label.name}** ${g.label.options[i]}\n`;}
  }
  return list;
}

function checkArgs(args) {
  const checks = ["-sh", "-g"];
  let output = [];
  for (let i = 0; i < checks.length; i++) {
    if (args.includes(checks[i]))
      output.push(1);
    else
      output.push(0);
  }
  for (let j = 0; j < args.length; j++) {
    if (checks.includes(args[j])) {
      args.splice(j, 1);
      j--;
    }
  }
  return output;
}

exports.run = {
  execute(message, args, client) {
    // Emoji setup
    const ghost = client.emojis.cache.get(e.ghost);
    const beta = client.emojis.cache.get(e.beta);
    const main = client.emojis.cache.get(e.main);
    const dead = client.emojis.cache.get(e.dead);

    // Checks for special arguments
    var conditions = [];
    if (args) conditions = checkArgs(args);

    // Creates an embed shell
    const embed = new Discord.MessageEmbed();

    if (args.length >= 1 && conditions[1] == 0) { // Detailed command help

      const commandName = args[0];
      const cmdy = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));

      if(!cmdy) return;

      // Begins preparing embed data
      var ext = "";
      if(cmdy.help.dead === 1) ext += `${dead} `;
      if(cmdy.help.wip === 1) ext += `${beta} `;
      if(cmdy.help.hide === 1) ext += `${ghost} `;
      ext += " ";

      // Sets up the embed
      embed.setFooter(`Requested by ${message.author.tag} / <> is required, [] is optional`, message.author.avatarURL());
      embed.setTimestamp();
      if(cmdy.help.dead === 1)
        embed.setColor(0xff4d4d);
      else if(cmdy.help.wip === 1)
        embed.setColor(0xffcc4d);
      else if(cmdy.help.hide === 1)
        embed.setColor(0xfefefe);
      else
        embed.setColor(0x7effaf);

      if(cmdy.help.name === commandName)
        embed.setTitle(`${ext}${process.env.prefix}${cmdy.help.name}`);
      else
        embed.setTitle(`${ext}${process.env.prefix}${cmdy.help.name} (${process.env.prefix}${commandName})`);

      let desc = cmdy.help.description;
      if(cmdy.help.aliases && Array.isArray(cmdy.help.aliases) == false)
        desc += `\n\• Alias: ${process.env.prefix}${cmdy.help.aliases}`;
      else if(cmdy.help.aliases)
        desc += `\n\• Aliases: ${process.env.prefix}${cmdy.help.aliases.join(`, ${process.env.prefix}`)}`;
      
      if(Array.isArray(cmdy.help.usage) == false) {
        desc += `\n\• Usage: ${cmdy.help.usage}`;
      } else {
        desc += `\n\• Usage: ${cmdy.help.usage[0]}`;
        for(let i = 1; i < cmdy.help.usage.length; i++) {desc += `\n   **or** ${process.env.prefix}${cmdy.help.name} ${cmdy.help.usage[i]}`;}
      }

      if(cmdy.help.helpurl)
        desc += `\n\nFor more information, [tap/click here](${cmdy.help.helpurl})`;
      
      embed.setDescription(desc);

    } else if (args.length >= 1 && conditions[1] == 1) { // Detailed game help

      const gameName = args[0];
      const gmz = client.games.get(gameName)
      || client.games.find(gm => gm.label.aliases && gm.label.aliases.includes(gameName));

      if(!gmz) return;

      // Begins preparing embed data
      var ext = "";
      if(gmz.label.deleted === 1) ext += `${dead} `;
      if(gmz.label.indev === 1) ext += `${beta} `;
      if(gmz.label.exclusive === 1) ext += `${ghost} `;
      ext += " ";

      // Sets up the embed
      embed.setFooter(`Requested by ${message.author.tag} / <> is required, [] is optional`, message.author.avatarURL());
      embed.setTimestamp();
      if(gmz.label.deleted === 1)
        embed.setColor(0xff4d4d);
      else if(gmz.label.indev === 1)
        embed.setColor(0xffcc4d);
      else if(gmz.label.exclusive === 1)
        embed.setColor(0xfefefe);
      else
        embed.setColor(0x7effaf);
      
      if(gmz.label.name === gameName)
        embed.setTitle(`${ext}${gmz.label.name}`);
      else
        embed.setTitle(`${ext}${gmz.label.name} (${gameName})`);

      let desc = gmz.label.description;
      if(Array.isArray(gmz.label.aliases) == false)
        desc += `\n\• Alias: ${gmz.label.aliases}`;
      else if(gmz.label.aliases >= 2)
        desc += `\n\• Aliases: ${gmz.label.aliases.join(`, `)}`;
      
      if (gmz.label.options && !Array.isArray(gmz.label.optionsdesc)) {
        desc += `\n\nOptions:\n\• ${gmz.label.optionsdesc}`;
      } else if (gmz.label.options && Array.isArray(gmz.label.optionsdesc)) {
        desc += `\n\nOptions:\n\• ${gmz.label.optionsdesc[0]}`;
        for(let i = 1; i < gmz.label.optionsdesc.length; i++) {desc += `\n\• ${gmz.label.optionsdesc[i]}`;}
      }

      if(gmz.label.helpurl)
        desc += `\n\nFor more information, [tap/click here](${gmz.label.helpurl})`

      embed.setDescription(desc);

    } else if (conditions[1] == 1) { // General game help

      // Sets up the embed
      embed.setColor(0x7effaf);
      embed.setFooter(`Requested by ${message.author.tag} / <> is required, [] is optional`, message.author.avatarURL());
      embed.setTimestamp();
      embed.setAuthor("Game Library", client.user.avatarURL(), "https://lx375.weebly.com/gyromina/");
      embed.setTitle(`Do **${process.env.prefix}help -g [game]** for more detailed game info.`);

      var glist = "";
      var gctr = 0;
      // Creates the main game list
      client.games.forEach(g => {
        if(g.label.exclusive === 1 || g.label.indev === 1 || g.label.deleted === 1) return;   
        glist = glist + setGameOptions(g);
        gctr++;
      });
      if(gctr != 0) embed.addField(`Downloaded ${main}`, `${glist}`, true);

      // If possible, creates the indev game list
      if(process.env.exp === "1") {
        glist = "**Still in development; play at your own risk!**\n";
      } else {
        glist = "These games have not been released.\n";
      }
      gctr = 0;
      client.games.forEach(g => {
        if(g.label.exclusive === 1 || g.label.indev === 0 || g.label.deleted === 1) return;
        glist = glist + setGameOptions(g);
        gctr++;
      });
      if(gctr != 0) embed.addField(`In Development ${beta}`, `${glist}`, true);

      // If specified, creates the hidden and depricated command lists
      if(conditions[0] == 1) {
        glist = "These games can only be played by certain people.\n";      
        gctr = 0;
        client.games.forEach(g => {
          if(g.label.exclusive === 0 || g.label.deleted === 1) return;
          glist = glist + setGameOptions(g);
          gctr++;
        });
        if(gctr != 0) embed.addField(`Exclusive Games ${ghost}`, `${glist}`, true);

        glist = "These games have been deleted from the game library.\n";      
        gctr = 0;
        client.games.forEach(g => {
          if(g.label.deleted === 0) return;
          glist = glist + setGameOptions(g);
          gctr++;
        });
        if(gctr != 0) embed.addField(`Removed Games ${dead}`, `${glist}`, true);
      }
    } else { // General command help

      // Sets up the embed
      embed.setColor(0x7effaf);
      embed.setFooter(`Requested by ${message.author.tag} / <> is required, [] is optional`, message.author.avatarURL());
      embed.setTimestamp();
      embed.setAuthor("Master Command List", client.user.avatarURL(), "https://lx375.weebly.com/gyromina/commands");
      embed.setTitle(`Do **${process.env.prefix}help [command]** for more detailed command info.`);

      var cmdlist = "";
      var cmdctr = 0;
      // Creates the main command list
      client.commands.forEach(c => {
        if(c.help.hide === 1 || c.help.wip === 1 || c.help.dead === 1) return;   
        cmdlist = cmdlist + setParams(c);
        cmdctr++;
      });
      if(cmdctr != 0) embed.addField(`Main Commands ${main}`, `${cmdlist}`, true);

      // If possible, creates the experimental command list
      if(process.env.exp === "1") {
        cmdlist = "**Unstable commands; use at your own risk!**\n";
      } else {
        cmdlist = "These commands are currently unavailable.\n";
      }
      cmdctr = 0;
      client.commands.forEach(c => {
        if(c.help.hide === 1 || c.help.wip === 0 || c.help.dead === 1) return;
        cmdlist = cmdlist + setParams(c);
        cmdctr++;
      });
      if(cmdctr != 0) embed.addField(`Experimental (WIP) Commands ${beta}`, `${cmdlist}`, true);

      // If specified, creates the hidden and depricated command lists
      if(conditions[0] == 1) {
        cmdlist = "Usage of these commands is restricted.\n";      
        cmdctr = 0;
        client.commands.forEach(c => {
          if(c.help.hide === 0 || c.help.dead === 1) return;
          cmdlist = cmdlist + setParams(c);
          cmdctr++;
        });
        if(cmdctr != 0) embed.addField(`Hidden Commands ${ghost}`, `${cmdlist}`, true);

        cmdlist = "These commands no longer exist.\n";      
        cmdctr = 0;
        client.commands.forEach(c => {
          if(c.help.dead === 0) return;
          cmdlist = cmdlist + setParams(c);
          cmdctr++;
        });
        if(cmdctr != 0) embed.addField(`Deprecated Commands ${dead}`, `${cmdlist}`, true);
      }
    }
    // Sends the embed
    message.channel.send({embed: embed});
  },
};

exports.help = {
  "name": "help",
  "aliases": ["commands", "cmds", "command", "cmd", "gamelist", "cmdlist", "commandlist"],
  "description": "Provides command and game help.",
  "usage": `${process.env.prefix}help [command/game] [queries]`,
  "params": "[command/game] [queries]",
  "helpurl": "https://lx375.weebly.com/gyrocmd-help",
  "hide": 0,
  "wip": 0,
  "dead": 0,
};
