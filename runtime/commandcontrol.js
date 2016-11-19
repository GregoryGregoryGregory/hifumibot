'use strict'
var directory = require('require-directory')
var com = directory(module, './commands', {
  exclude: /custom/
})
var cus = directory(module, './commands/custom')
var Logger = require('./internal/logger.js').Logger
var commands = []
var alias = []
var config = require('../config.json')

for (var d in com) {
  for (var o in com[d].Commands) {
    commands[o] = com[d].Commands[o]
    if (com[d].Commands[o].aliases !== undefined) {
      for (var u in com[d].Commands[o].aliases) {
        if (alias[com[d].Commands[o].aliases[u]] && typeof alias[com[d].Commands[o].aliases[u]] !== 'function') {
          throw new Error('Aliases cannot be shared between commands!')
        }
        alias[com[d].Commands[o].aliases[u]] = com[d].Commands[o]
      }
    }
  }
}

if (cus !== null) {
  for (var g in cus) {
    for (var l in cus[g].Commands) {
      if (commands[l] && !cus[g].Commands[l].overwrite && typeof commands[l] !== 'function') {
        throw new Error('Custom commands cannot replace default commands without overwrite enabled!')
      }
      commands[l] = cus[g].Commands[l]
      if (cus[g].Commands[l].aliases !== undefined) {
        for (var e in cus[g].Commands[l].aliases) {
          if (alias[cus[g].Commands[l].aliases[e]] && typeof alias[cus[g].Commands[l].aliases[e]] !== 'function') {
            throw new Error('Aliases cannot be shared between commands!')
          }
          alias[cus[g].Commands[l].aliases[e]] = cus[g].Commands[l]
        }
      }
    }
  }
}

exports.helpHandle = function (msg, suffix) {
  var msgArray = []
  var msgArraytwo = []
  msgArray.push('Hello, my name is Hifumi and I\'m a multifunctional + music bot that will give you fun and is very easy to use.')
    msgArray.push('**Hifumi commands**')
    msgArray.push('**Fun:** `' + config.settings.prefix + 'ball` `' + config.settings.prefix + 'choose` `' + config.settings.prefix + 'coinflip` `' + config.settings.prefix + 'dice` `' + config.settings.prefix + 'gif` `' + config.settings.prefix + 'hifumi` `' + config.settings.prefix + 'leetspeak` `' + config.settings.prefix + 'rate` `' + config.settings.prefix + 'roll` `' + config.settings.prefix + 'rps` `' + config.settings.prefix + 'say` `' + config.settings.prefix + 'talk`')
    msgArray.push('**Useful/Interests:** `' + config.settings.prefix + 'fact` `' + config.settings.prefix + 'catfacts` `' + config.settings.prefix + 'server-info` `' + config.settings.prefix + 'userinfo` `' + config.settings.prefix + 'advice` `' + config.settings.prefix + 'yesno` `' + config.settings.prefix + 'nicknames`')
	msgArray.push('**Search:** `' + config.settings.prefix + 'urban` `' + config.settings.prefix + 'weather` `' + config.settings.prefix + 'google` `' + config.settings.prefix + 'twitch` `' + config.settings.prefix + 'cutecat`')
	msgArray.push('**Moderation:** `' + config.settings.prefix + 'ban` `' + config.settings.prefix + 'kick` `' + config.settings.prefix + 'setlevel` `' + config.settings.prefix + 'setnsfw` `' + config.settings.prefix + 'clean` `' + config.settings.prefix + 'customize`')
	msgArray.push('**Music:** Comment "' + config.settings.prefix + 'startmusic" when you want to listen music')
	msgArray.push('**Tags:** `' + config.settings.prefix + 'tag create` `' + config.settings.prefix + 'tag edit` `' + config.settings.prefix + 'tag delete` `' + config.settings.prefix + 'tag owner`')
	msgArray.push('**NSFW:** `' + config.settings.prefix + 'e621` `' + config.settings.prefix + 'rule34`')
	msgArray.push('**Bot:** `' + config.settings.prefix + 'ping` `' + config.settings.prefix + 'about`')
	msgArray.push('Detailed help about my commands can be found in my official website: http://hifumibot.tumblr.com/commands')
    msgArray.push('This bot is forked from Hifumi, a multifunctional Discord bot, take a look to our GitHub: https://github.com/Underforest/HifumiBot')
    msg.author.openDM().then((y) => {
      if (!msg.isPrivate) {
        msg.channel.sendMessage('I sent you a DM with command help from me, ' + msg.author.mention + '!')
      }
      y.sendMessage(msgArray.join('\n'))
      y.sendMessage(msgArraytwo.join('\n'))
    }).catch((e) => {
      Logger.error(e)
      msg.channel.sendMessage('I want to DM you my command help but I just can\'t, do you have DM public sending enabled on this server for your account?')
    })
}

exports.Commands = commands;
exports.Aliases = alias;