var Commands = []
var request = require('request')
var config = require('../../../config.json')
var Logger = require('../../internal/logger.js').Logger
var argv = require('minimist')(process.argv.slice(2))

//English -START-

Commands.ping = {
  name: 'ping',
  module: 'default',
  timeout: 10,
  level: 0,
fn: function (msg, suffix) { 
 var initTime = new Date(msg.timestamp)
  msg.channel.sendMessage('Pong! | :hourglass:').then((m) => {
  m.edit('Pong! | :timer: ' + Math.floor(new Date(m.timestamp) - initTime) + 'ms')
  })
}
}

Commands.say = {
  name: 'say',
  module: 'default',
  timeout: 10,
  level: 0,
  fn: function (msg, suffix) {
    var re = /(discord(\.gg|app\.com\/invite)\/([\w]{16}|([\w]+-?){3}))/
    if (msg.mentions.length >= 1) {
      msg.channel.sendMessage('I won\'t say mentions, thanks!')
    } else if (re.test(msg.content)) {
      msg.channel.sendMessage('Sorry, but I won\'t say that. Thanks! :ok_hand:')
    } else {
      msg.channel.sendMessage('\u200B' + suffix.replace(/@everyone/, '@every\u200Bone').replace(/@here/, '@he\u200Bre'))
	}
    }
  }
  
Commands.echo = {
  name: 'echo',
  module: 'master',
  timeout: 10,
  level: 0,
  fn: function (msg, suffix) {
          msg.delete()
      msg.channel.sendMessage(suffix)
	}
    }

Commands.clean = {
  name: 'clean',
  noDM: true,
  timeout: 10,
  level: 3,
  fn: function (msg, suffix, bot) {
    var guild = msg.guild
    var user = msg.author
    var userPerms = user.permissionsFor(guild)
    var botPerms = bot.User.permissionsFor(guild)
    if (!userPerms.Text.MANAGE_MESSAGES) {
      msg.reply(':no_entry_sign: Sorry, but `Manage Messages` is required to use this.')
    } else if (!botPerms.Text.MANAGE_MESSAGES) {
      msg.reply(':warning: Plese give me `Manage Messages` permission before doing that!')
    } else {
      if (!suffix || isNaN(suffix) || suffix > 100 || suffix < 0) {
        msg.reply(':warning: I can only clean messages from 1 to 100 messages.')
      } else {
        msg.channel.fetchMessages(suffix).then((result) => {
          bot.Messages.deleteMessages(result.messages)
		        msg.reply(':recycle: Successfully cleaned ' + suffix + ' messages').then((m) => {
        setTimeout(() => {
          m.delete().catch((e) => Logger.error(e))
        }, 5000)
      })
			  .catch((error) => {
          msg.channel.sendMessage('Something wrong happened, try again later.')
          Logger.error(error)
        })
	  })
        }
    }
  }
}

Commands.eval = {
  name: 'eval',
  level: 'master',
  fn: function (msg, suffix, bot) {
    if (msg.author.id === bot.User.id) return
    var util = require('util')
    try {
      var returned = eval(suffix)
      var str = util.inspect(returned, {
        depth: 1
      })
      if (str.length > 1900) {
        str = str.substr(0, 1897)
        str = str + '...'
      }
      str = str.replace(new RegExp(bot.token, 'gi'), 'Why do you want to know that?')
      msg.channel.sendMessage(':white_check_mark: **Evaluation success!**\n\nOutput:\n```xl\n' + str + '\n```').then((ms) => {
        if (returned !== undefined && returned !== null && typeof returned.then === 'function') {
          returned.then(() => {
            var str = util.inspect(returned, {
              depth: 1
            })
            if (str.length > 1900) {
              str = str.substr(0, 1897)
              str = str + '...'
            }
            ms.edit('```xl\n' + str + '\n```')
          }, (e) => {
            var str = util.inspect(e, {
              depth: 1
            })
            if (str.length > 1900) {
              str = str.substr(0, 1897)
              str = str + '...'
            }
            ms.edit('```xl\n' + str + '\n```')
          })
        }
      })
    } catch (e) {
      msg.channel.sendMessage(':no_entry_sign: **Evaluation failed!**\n\nOutput:\n```xl\n' + e + '\n```')
    }
  }
}

Commands.plaineval = {
  name: 'plaineval',
  level: 'master',
  fn: function (msg, suffix, bot) {
    if (msg.author.id === bot.User.id) return
    var evalfin = []
    try {
	  evalfin.push(':white_check_mark: **Evaluation success!**\n\n')
	  evalfin.push('Output:')
      evalfin.push('```xl')
      evalfin.push(eval(suffix))
      evalfin.push('```')
    } catch (e) {
      evalfin = []
	  evalfin.push(':no_entry_sign: **Evaluation failed!**\n\n')
	  evalfin.push('Output:')
      evalfin.push('```xl')
      evalfin.push(e)
      evalfin.push('```')
    }
    msg.channel.sendMessage(evalfin.join('\n'))
  }
}

Commands.sleep = {
  name: 'sleep',
  level: 'master',
  fn: function (msg, suffix, bot) {
	msg.channel.sendMessage('Shutting down...')
    bot.disconnect()
    Logger.warn('Bye bye! ^-^')
    process.exit(0)
  }
}

Commands.restart = {
  name: 'restart',
  level: 'master',
  fn: function (msg, suffix, bot) {
	msg.channel.sendMessage('Restarting ' + bot.User.username + '...')
	Logger.warn('Restarting...')
    bot.disconnect()
    bot.connect()
  }
}

Commands.setlevel = {
  name: 'setlevel',
  noDM: true,
  module: 'default',
  level: 3,
  fn: function (msg, suffix, bot) {
    var Permissions = require('../../databases/controllers/permissions.js')
    suffix = suffix.split(' ')
    if (isNaN(suffix[0])) {
      msg.reply(':warning: Please use the following order to set levels: ' + config.settings.prefix + 'setlevel (number) @userorroletosetlevel.\n-1 for ignored users, 0 for normal users, 1-2 for users with music administration permissions and 3 for users with overall moderation permissions.')
    } else if (suffix[0] > 3) {
      msg.channel.sendMessage(':no_entry_sign: Setting a level higher than 3 is not allowed.')
    } else if (msg.mentions.length === 0 && msg.mention_roles.length === 0) {
      msg.reply(':warning: Please @mention the user(s)/role(s) you want to set the permission level of.')
    } else if (msg.mentions.length === 1 && msg.mentions[0].id === bot.User.id) {
      msg.reply(":joy: Thanks for it, but I can do anything, even without a level. :) Remember that I'm a bot.")
    } else {
      Permissions.adjustLevel(msg, msg.mentions, parseFloat(suffix[0]), msg.mention_roles).then(function () {
        msg.channel.sendMessage(':white_check_mark: Done!')
      }).catch(function (err) {
        msg.channel.sendMessage(':no_entry_sign: Something went wrong!')
        Logger.error(err)
      })
    }
  }
}

Commands.setnsfw = {
  name: 'setnsfw',
  noDM: true,
  module: 'default',
  level: 3,
  fn: function (msg, suffix) {
    var Permissions = require('../../databases/controllers/permissions.js')
    if (msg.guild) {
      if (suffix === 'on' || suffix === 'off') {
        Permissions.adjustNSFW(msg, suffix).then((allow) => {
          if (allow) {
            msg.channel.sendMessage('NSFW is now enabled. ( ͡° ͜ʖ ͡°)')
          } else if (!allow) {
            msg.channel.sendMessage('NSFW is now disabled.')
          }
        }).catch(() => {
          msg.reply("Error while setting NSFW flag!")
        })
      } else {
        msg.channel.sendMessage('Please specify if you want to allow (on) or disallow (off).')
      }
    } else {
      msg.channel.sendMessage("NSFW commands are always allowed in DMs.")
    }
  }
}

Commands.stats = {
  name: 'stats',
  timeout: 10,
  level: 0,
  fn: function (msg, suffix, bot) {
  msg.channel.sendMessage ('Hello, ' + msg.author.username + '. ' + `I am ${bot.User.username}, nice to meet you.

**Stats**
${bot.Guilds.length} servers
${bot.Channels.length} channels
${bot.Users.length} users
${bot.VoiceConnections.length} voice channels
${bot.DirectMessageChannels.length} DM chats
${bot.Messages.length} messages
Sharding - ${(argv.shardmode ? 'Shard ' + argv.shardid + ', currently propagating ' + argv.shardcount + ' shards.' : 'Disabled')}
`)
  }
}

Commands.invite = {
  name: 'invite',
  timeout: 10,
  level: 0,
  fn: function (msg, suffix, bot) {
  msg.channel.sendMessage ('Use this link to invite me to your server:\n**NOTE: Select all permissions as needed but it\'s recommendable to keep enabled all, so I can work fine.**\nOverall permissions: <https://discordapp.com/oauth2/authorize?client_id=' + bot.User.id + '&scope=bot&permissions=2146958463>\nNo permissions/role: <https://discordapp.com/oauth2/authorize?client_id=' + bot.User.id + '&scope=bot&permissions=0>')
  }
}

Commands.kick = {
  name: 'kick',
  noDM: true,
  module: 'default',
  level: 3,
  fn: function (msg, suffix, bot) {
    var guild = msg.guild
    var user = msg.author
    var botuser = bot.User
    var guildPerms = user.permissionsFor(guild)
    var botPerms = botuser.permissionsFor(guild)
    if (!guildPerms.General.KICK_MEMBERS) {
      msg.channel.sendMessage(':no_entry_sign: Sorry, you need permissions to kick members.')
    } else if (!botPerms.General.KICK_MEMBERS) {
      msg.reply(":warning: I don't have enough permissions to do this!")
    } else if (msg.mentions.length === 0) {
      msg.channel.sendMessage(':warning: Please mention who you want to kick.')
      return
    } else if (msg.mentions.length === 1 && msg.mentions[0].id === bot.User.id) {
	  msg.channel.sendMessage(':information_source: If I don\'t really like you, using the command ``' + config.settings.prefix + 'leave`` would be more accurate.')	
    } else if (msg.mentions.length === 1 && msg.mentions[0].id === msg.author.id) {
	  msg.channel.sendMessage(':no_entry_sign: You can\'t kick yourself.')	
    } else {
      msg.mentions.map(function (user) {
        var member = msg.guild.members.find((m) => m.id === user.id)
        member.kick().then(() => {
          msg.channel.sendMessage(':white_check_mark: Kicked ' + user.username)
        }).catch((error) => {
          msg.channel.sendMessage(':no_entry_sign: Failed to kick ' + user.username)
          Logger.error(error)
        })
      })
    }
  }
}

Commands.customize = {
  name: 'customize',
  noDM: true,
  level: 3,
  fn: function (msg, suffix) {
    var c = require('../../databases/controllers/customize.js')
    suffix = suffix.split(' ')
    var x = suffix.slice(1, suffix.length).join(' ')
    if (suffix[0] === 'help') {
      c.helpHandle(msg)
    } else {
      c.adjust(msg, suffix[0], x).then((r) => {
        msg.channel.sendMessage(':white_check_mark: Adjusted ' + suffix[0] + ' to `' + r + '`')
      }).catch((e) => {
        msg.channel.sendMessage(':no_entry_sign: Whoops, ' + e)
      })
    }
  }
}

Commands.ban = {
  name: 'ban',
  noDM: true,
  module: 'default',
  level: 3,
  fn: function (msg, suffix, bot) {
    var guild = msg.guild
    var user = msg.author
    var botuser = bot.User
    var guildPerms = user.permissionsFor(guild)
    var botPerms = botuser.permissionsFor(guild)
    if (!guildPerms.General.BAN_MEMBERS) {
      msg.reply(':no_entry_sign: Sorry, but you need Ban Members permission first.')
    } else if (!botPerms.General.BAN_MEMBERS) {
      msg.channel.sendMessage(':no_entry_sign: I need Ban Members permission, sorry!')
    } else if (msg.mentions.length === 0) {
      msg.channel.sendMessage(':warning: Please mention who you want to ban.')
	} else if (msg.mentions.length === 1 && msg.mentions[0].id === bot.User.id) {
	  msg.channel.sendMessage(':information_source: If I don\'t really like you, using the command ``' + config.settings.prefix + 'leave`` would be more accurate.')	
    } else if (msg.mentions.length === 1 && msg.mentions[0].id === msg.author.id) {
	  msg.channel.sendMessage(':no_entry_sign: You can\'t ban yourself.')	
    } else {
      var days = suffix.split(' ')[msg.mentions.length] || 0
      if ([0, 1, 7].indexOf(parseFloat(days)) > -1) {
        msg.mentions.map(function (user) {
          var member = msg.guild.members.find((m) => m.id === user.id)
          member.ban(days).then(() => {
            msg.channel.sendMessage(":white_check_mark: I've banned " + user.username + ' deleting ' + days + ' days of messages.')
          }).catch((error) => {
            msg.channel.sendMessage(':no_entry_sign: Failed to ban ' + user.username)
            Logger.error(error)
          })
        })
      } else {
        msg.reply(':warning: Your last argument must be a number: 0, 1 or 7')
      }
    }
  }
}

Commands.nicknames = {
  name: 'nicknames',
  noDM: true,
  level: 0,
  fn: function (msg, suffix) {
    const n = require('../../databases/controllers/users.js')
    if (msg.mentions.length === 0) {
      msg.channel.sendMessage('Please mention the user you want to see name change history.')
      return
    }
    msg.mentions.map((u) => {
      n.names(u).then((n) => {
        msg.channel.sendMessage('Nicknames for **' + suffix + '**: ' + n.join('\n'))
      })
    })
  }
}

Commands.leave = {
  name: 'leave',
  noDM: true,
  level: 3,
  fn: function (msg, suffix) {
    if (msg.isPrivate) {
      msg.channel.sendMessage(':joy: What? Kick me from my own DM chat? That\'s funny!')
    } else if (suffix === msg.guild.name) {
      msg.channel.sendMessage(':wave: OK, bye bye!')
      msg.guild.leave()
    } else if (!suffix) {
		msg.channel.sendMessage(':warning: **Are you really sure you want to kick ' + bot.User.username + ' from this server?**\nAll server bot data, as well as configuration may be lost after this action.\n\nTo confirm, type the following text: ``' + config.settings.prefix + 'leave ' + msg.guild.name + '``\nTo cancel, ignore this message.')
    } else {
		msg.channel.sendMessage(':no_entry_sign: Invalid response, if you want me out of here, use ``' + config.settings.prefix + 'leave ' + msg.guild.name + '``\nTo cancel, ignore this message.')
    } 
}
}

  //English -FINISH-

exports.Commands = Commands