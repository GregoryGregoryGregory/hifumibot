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

exports.helpHandle = function (msg, suffix, bot) {
  var msgArray = []
  var msgArraytwo = []
  if (!suffix) {
  msgArray.push('You requested my command help so here it is.')
  msgArray.push('To get started, select your favorite command category with ``' + config.settings.prefix + 'help number`` and know more.\n')
    msgArray.push('**Commands**')
	msgArray.push('```')
	msgArray.push('1. Fun/Misc.')
	msgArray.push('2. Utilities')
	msgArray.push('3. Moderation settings')
	msgArray.push('4. Music')
	msgArray.push('5. Tags')
	msgArray.push('6. NSFW')
	msgArray.push('7. Bot info.')
	msgArray.push('```')
    msgArray.push('This bot is forked from Hifumi - a discord bot by Underforest#1284: <https://github.com/Underforest/hifumibot>')
	} else if (suffix === '1') {
	msgArray.push('**Fun/Misc.**')
	msgArray.push('```')
	msgArray.push(config.settings.prefix + '8ball - ask a question to the magic 8 ball.')
	msgArray.push(config.settings.prefix + 'chocolate - Gift a chocolate to someone.')
	msgArray.push(config.settings.prefix + 'chocolate eat - Eat an already gifted chocolate.')
	msgArray.push(config.settings.prefix + 'choose - choose the best option between 2 options or more, separate options with a ", ".')
	msgArray.push(config.settings.prefix + 'coinflip - flip a coin and get a result.')
	msgArray.push(config.settings.prefix + 'dice - roll a dice, you can use "1dnumber" as suffix to modify dice sides (replace number with a number)')
	msgArray.push(config.settings.prefix + 'garfield - get a Garfield comic from any date of 1978-today.')
	msgArray.push(config.settings.prefix + 'gif - search for a GIF on Giphy.')
	msgArray.push(config.settings.prefix + 'leetspeak - c0nv3r7 `/0ur 73x7 1ik3 7hi5.')
	msgArray.push(config.settings.prefix + 'rate - rate a user or character.')
	msgArray.push(config.settings.prefix + 'rip - create a ripme.xyz link with the user you mention.')
	msgArray.push(config.settings.prefix + 'roll - get a random number from 1 to 100.')
	msgArray.push(config.settings.prefix + 'rps - play rock, paper and scissors.')
	msgArray.push(config.settings.prefix + 'slap - slap someone.')
	msgArray.push(config.settings.prefix + 'say - make the bot repeat something, mentions and invites are not allowed.')
	msgArray.push(config.settings.prefix + 'talk - talk and have a conversation (powered by Cleverbot)')
	msgArray.push(config.settings.prefix + 'triggered - react with a Triggered meme.')
	msgArray.push('```')
	} else if (suffix === '2') {
	msgArray.push('**Utilities**')
	msgArray.push('```')
	msgArray.push(config.settings.prefix + 'advice - get a random advice for something random.')
	msgArray.push(config.settings.prefix + 'fact - get a fact for something interesting.')
	msgArray.push(config.settings.prefix + 'catfacts - get a curious cat fact.')
	msgArray.push(config.settings.prefix + 'google - let me google that for you!')
	msgArray.push(config.settings.prefix + 'nicknames - use this with a user to know his/her previous nicknames.')
	msgArray.push(config.settings.prefix + 'server-info - get some information about the server you are in.')
	msgArray.push(config.settings.prefix + 'twitch - search for a Twitch channel and know if he/she is streaming or not.')
	msgArray.push(config.settings.prefix + 'userinfo - get some information about a server member.')
	msgArray.push(config.settings.prefix + 'urban - search for a word on Urban Dictionary database.')
	msgArray.push(config.settings.prefix + 'weather - search the weather for a city.')
	msgArray.push(config.settings.prefix + 'yesno - get a random GIF saying if "yes" or "no" to your question.')
	msgArray.push('```')	
	} else if (suffix === '3') {
	msgArray.push('**Moderation**')
	msgArray.push('```')
	msgArray.push(config.settings.prefix + 'ban - apply the ban hammer to someone.')
	msgArray.push(config.settings.prefix + 'clean - clean from 1 to 100 messages.')
	msgArray.push(config.settings.prefix + 'customize - main command to modify bot replies, welcome system and prefix. Use ' + config.settings.prefix + 'customize help to know more.')
	msgArray.push(config.settings.prefix + 'kick - kick someone, keep in mind that he/she can re-join.')
	msgArray.push(config.settings.prefix + 'setlevel - use it with a number and a user to level up her/him!')
	msgArray.push(config.settings.prefix + 'setnsfw - toggle the NSFW commands on the channel.')
	msgArray.push('```')	
	} else if (suffix === '4') {
	msgArray.push('**Music**')
	msgArray.push('```')
	msgArray.push(config.settings.prefix + 'music - I will play music in the voice channel. You can specify one or not.')
	msgArray.push(config.settings.prefix + 'request - I will play a song for you, use a link from YouTube, Soundcloud or a mp3 uploaded file')
	msgArray.push(config.settings.prefix + 'listenmoe - I will play listen.moe radio station.')
	msgArray.push(config.settings.prefix + 'radio - I will play a radio stream file for you. Use ' + config.settings.prefix + 'radio help to know how to get stream link of your favorite station.')
	msgArray.push(config.settings.prefix + 'youtube - search something in YouTube.')
    msgArray.push(config.settings.prefix + 'song pause - The current song will be paused if it\'s playing.')
    msgArray.push(config.settings.prefix + 'song play - The current song will be resumed if it\'s paused.')
    msgArray.push(config.settings.prefix + 'volume - Change the volume of the current song.')
    msgArray.push(config.settings.prefix + 'playlist - List upcoming requested songs. I will show this in order.')
    msgArray.push(config.settings.prefix + 'shuffle - Shuffle the music playlist and songs will be played in random order.')
    msgArray.push(config.settings.prefix + 'skip - Vote to skip the current song if you don\'t like it.')
    msgArray.push(config.settings.prefix + 'forceskip - Force skip the current song.')
    msgArray.push(config.settings.prefix + 'shutdown - I will no longer play music in the voice channel.')
	msgArray.push('```')
	} else if (suffix === '5') {
	msgArray.push('**Tags**')
	msgArray.push('```')
	msgArray.push(config.settings.prefix + 'tag create - create a new tag (order: command tag content)')
	msgArray.push(config.settings.prefix + 'tag delete - delete an existing tag (order: command tag)')
    msgArray.push(config.settings.prefix + 'tag edit - edit an existing tag (order: command tag new content)')
    msgArray.push(config.settings.prefix + 'tag owner - display the owner for an existing tag (order: command tag)')
	msgArray.push('```')
	} else if (suffix === '6') {
	msgArray.push('**NSFW**')
	msgArray.push('```')
	msgArray.push(config.settings.prefix + 'e621 - search for furry porn on e621.')
	msgArray.push(config.settings.prefix + 'rule34 - if it exists, there\'s porn of it.')
	msgArray.push(config.settings.prefix + 'konachan - search for hentai on Konachan.')
    msgArray.push(config.settings.prefix + 'greenteaneko - show a random bizarre GreenTeaNeko comic.')
	msgArray.push('```')
	} else if (suffix ===  '7') {
	msgArray.push('**Bot information**')
	msgArray.push('```')
	msgArray.push(config.settings.prefix + 'stats - display the bot stadistics.')
	msgArray.push(config.settings.prefix + 'help - display the command help menu.')
	msgArray.push(config.settings.prefix + 'ping - respond with pong plus response delay on ms, useful to test the bot functioning.')
	msgArray.push(config.settings.prefix + 'invite - display the bot OAuth invite link.')
	msgArray.push(config.settings.prefix + 'leave - I\'ll leave the server.')
	msgArray.push('```')
	} else {
	msgArray.push(':warning: Uncategorized, **please** add a valid number to know commands from a category.')
	}
    msg.author.openDM().then((y) => {
      if (!msg.isPrivate) {
        msg.channel.sendMessage(':white_check_mark: Command help has been sent, ' + msg.author.mention + '!')
      }
      y.sendMessage(msgArray.join('\n'))
      y.sendMessage(msgArraytwo.join('\n'))
    }).catch((e) => {
      Logger.error(e)
      msg.channel.sendMessage(':warning: You must allow direct messages from anyone on this server in order to send you my command help. http://puu.sh/srQKc.gif')
    })
}

exports.Commands = commands;
exports.Aliases = alias;
