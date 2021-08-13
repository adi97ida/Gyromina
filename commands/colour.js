// Require discord.js and some global functions (colour conversions + Clean)
const D = require('discord.js');
const {rgbToCmyk, cmykToRgb, rgbToHex, hexToRgb, hexToInt, intToHex, Clean, minMax} = require('../systemFiles/globalFunctions.js');

// Regex setup
const hexX = /^(0x|#|\b)([a-f\d]{6})/i;
const rgbX = /^rgb\((\d+)[, ]+(\d+)[, ]+(\d+)\)/i;
const cmykX = /^cmyk\((\d+)%?[, ]+(\d+)%?[, ]+(\d+)%?[, ]+(\d+)%?\)/i;

function extract(xc) {
  let mTest = rgbX.test(xc);
  let nTest = cmykX.test(xc);
  let oTest = hexX.test(xc);
  if(mTest) {
    // xc -> RGB object
    let m = rgbX.exec(xc);
    return ["rgb", 1, {r: minMax(m[1], 0, 255), g: minMax(m[2], 0, 255), b: minMax(m[3], 0, 255)}];
  } else if(nTest) {
    // xc -> CMKY object
    let n = cmykX.exec(xc);
    return ["cmyk", 2, {c: minMax(n[1], 0, 100), m: minMax(n[2], 0, 100), y: minMax(n[3], 0, 100), k: minMax(n[4], 0, 100)}];
  } else if(!isNaN(parseInt(xc, 10)) || oTest) {
    // xc -> int or hex, secondary check needed
    let o = hexX.exec(xc);
    if(o && (xc.startsWith("#") || xc.startsWith("0x") || /[a-f]+/i.test(xc) || /^0+/.test(o))) { // hex check
      // xc -> hex code
      return ["hex", 0, o[2]];
    } else if(!isNaN(parseInt(xc, 10)) && /(\d+)/i.exec(xc)[1].length != 6) { // int check
      // xc -> int
      return ["int", 3, parseInt(xc, 10)];
    } else { // ambiguous case
      // xc -> int; default
      return ["amb", 3, parseInt(xc, 10)];
    }

    /*return ["int", 3, parseInt(xc, 10)];
    return ["hex", 0, hexX.exec(xc)[2]];*/
  } else {
    // xc -> null; unsupported format
    return [null, null];
  }
}

exports.run = {
  execute(message, args, client) {
    if (args.length === 0)
      return message.reply(`I can't get colour data for a non-existent colour!`)

    // Decoding
    var [...code] = args;
    var col = extract(Clean(code.join(" ")));
    
    // Individual colour setup
    var hex;
    var rgb;
    var cmyk;
    var int;

    // Colour conversions
    switch(col[0]) {
      case "hex": {
        hex = col[2];
        int = hexToInt(hex);
        rgb = hexToRgb(`#${hex}`);
        cmyk = rgbToCmyk(rgb);
        break;
      }
      case "rgb": {
        rgb = col[2];
        cmyk = rgbToCmyk(rgb);
        hex = rgbToHex(rgb);
        int = hexToInt(hex);
        break;
      }
      case "cmyk": {
        cmyk = col[2];
        rgb = cmykToRgb(cmyk);
        hex = rgbToHex(rgb);
        int = hexToInt(hex);
        break;
      }
      case "int":
      case "amb": {
        int = Math.max(0, Math.min(col[2], Math.pow(2, 24)-1));
        hex = intToHex(int);
        rgb = hexToRgb(`#${hex}`);
        cmyk = rgbToCmyk(rgb);
        break;
      }
      case null:
        return message.reply(`Invalid colour code. Please check your syntax and try again.`);
    }

    // Encoding
    var strand = [`#${hex}`, `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`, `int: ${int}`];
    var head = strand.splice(col[1], 1);

    // Output setup
    const embed = new D.MessageEmbed()
      .setTitle(head[0])
      .setDescription(strand.join("\n"));
    switch(hex) {
      case "ffffff": embed.setColor(0xfefefe); break; // override because #ffffff is transparent
      default: embed.setColor(parseInt(`0x${hex}`)); break;
    }
      
    // Sends the embed
    switch (col[0]) {
      case "amb": return message.reply({content: `Ambiguous input detected, defaulting to a colour integer. If this is a hex code, add \`#\` or \`0x\` in front of it and try again.`, embeds: [embed]});
      default: return message.reply({content: `Here you go!`, embeds: [embed]});
    }
  }
}

exports.help = {
  "name": "colour",
  "aliases": ["color", "col", "cdat", "coldata", "cdata"],
  "description": 'Displays colour data.',
  "usage": `${process.env.prefix}colour <colour>`,
  "params": "<colour>",
  "weight": 1,
  "hide": 0,
  "wip": 0,
  "dead": 0,
};
