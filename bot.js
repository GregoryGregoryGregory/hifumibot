'use strict'
process.title = '~Hifumi v1.5.2~'

try {
  require('./config.json')
} catch (e) {
  console.log("\nSomething wrong happened with configuration file:\n\n" + e.message)
  process.exit()
}

var Discordie = require('discordie')
var Event = Discordie.Events
var bot
var runtime = require('./runtime/runtime.js')
var Logger = runtime.internal.logger.Logger
var timeout = runtime.internal.timeouts
var commands = runtime.commandcontrol.Commands
var aliases = runtime.commandcontrol.Aliases
var datacontrol = runtime.datacontrol
var argv = require('minimist')(process.argv.slice(2))
var Config
var config = require('./config.json')
var restarted = false
var axios = require('axios')
var Cb = require('cleverbot-node')
var cleverbot = new Cb()

Logger.info('Hello!')

if (argv.shardmode && !isNaN(argv.shardid) && !isNaN(argv.shardcount)) {
  Logger.info('Starting in ShardMode, this is shard ' + argv.shardid)
  bot = new Discordie({
    shardId: argv.shardid,
    shardCount: argv.shardcount
  })
} else {
  bot = new Discordie()
}

if (argv.forceupgrade) {
  if (argv.shardmode) {
    Logger.warn("Can't upgrade databases in ShardMode, restart normally to upgrade databases.")
    start()
  } else {
    Logger.warn('Force-starting database upgrade.')
    runtime.internal.upgrade.init().then((r) => {
      Logger.info(r)
      start()
    }).catch((e) => {
      Logger.error(e)
    })
  }
} else {
  start()
}

bot.Dispatcher.on(Event.GATEWAY_READY, function () {
  bot.Users.fetchMembers()
  runtime.internal.versioncheck.versionCheck(function (err, res) {
    if (err) {
      Logger.error('Version check failed, ' + err)
    } else if (res) {
      Logger.info(`Version check: ${res}`)
    }
  })
  Logger.info('Ready to start!')
  Logger.info(`Logged in as ${bot.User.username}#${bot.User.discriminator} (ID: ${bot.User.id}) and serving ${bot.Users.length} users in ${bot.Guilds.length} servers.`)
  setGame()
  })

bot.Dispatcher.on(Event.MESSAGE_CREATE, function (c) {
  if (!bot.connected) return
  datacontrol.users.isKnown(c.message.author)
  var prefix
  datacontrol.customize.prefix(c.message).then(function (p) {
    if (!p) {
      prefix = Config.settings.prefix
    } else {
      prefix = p
    }
    var cmd
    var suffix
    if (c.message.content.indexOf(prefix) === 0) {
      cmd = c.message.content.substr(prefix.length).split(' ')[0].toLowerCase()
      suffix = c.message.content.substr(prefix.length).split(' ')
      suffix = suffix.slice(1, suffix.length).join(' ')
    }
    if (c.message.author.bot || c.message.author.id === bot.User.id) {
      return
    }
    if (cmd === 'help') {
      runtime.commandcontrol.helpHandle(c.message, suffix)
	  Logger.info(`Executing <${c.message.resolveContent()}> from ${c.message.author.username}#${c.message.author.discriminator} (${c.message.author.id})`)
	}
    if (aliases[cmd]) {
      cmd = aliases[cmd].name
    }
    if (commands[cmd]) {
      if (typeof commands[cmd] !== 'object') {
        return
      }
      Logger.info(`Executing <${c.message.resolveContent()}> from ${c.message.author.username}#${c.message.author.discriminator} (${c.message.author.id})`)
      if (commands[cmd].level === 'master') {
        if (Config.permissions.master.indexOf(c.message.author.id) > -1) {
          try {
            commands[cmd].fn(c.message, suffix, bot)
          } catch (e) {
            c.message.channel.sendMessage(':warning: Oh no! I ran into an error. Please report this to my owner or wait for a further fix. \n```' + e + '```')
            Logger.error(`Command error, thrown by ${commands[cmd].name}: ${e}`)
          }
        } else {
          c.message.channel.sendMessage('This command is only for my owner.')
		        Logger.warn(`A normal user tried to access owner-only commands. Permission has been denied.`)
        }
      } else if (!c.message.isPrivate) {
        timeout.check(commands[cmd], c.message.guild.id, c.message.author.id).then((y) => {
          if (y !== true) {
            datacontrol.customize.reply(c.message, 'timeout').then((x) => {
              if (x === 'default') {
                c.message.channel.sendMessage(`**Please cooldown!** (${Math.round(y)} seconds left)`)
              } else {
                c.message.channel.sendMessage(x.replace(/%user/g, c.message.author.mention).replace(/%server/g, c.message.guild.name).replace(/%channel/, c.message.channel.name).replace(/%timeout/, Math.round(y)))
              }
            })
          } else {
            datacontrol.permissions.checkLevel(c.message, c.message.author.id, c.message.member.roles).then(function (r) {
              if (r >= commands[cmd].level) {
                if (!commands[cmd].hasOwnProperty('nsfw')) {
                  try {
                    commands[cmd].fn(c.message, suffix, bot)
                  } catch (e) {
                    c.message.channel.sendMessage(':warning: Oh no! I ran into an error. Please report this to my owner or wait for a further fix. \n```' + e + '```')
                    Logger.error(`Command error, thrown by ${commands[cmd].name}: ${e}`)
                  }
                } else {
                  datacontrol.permissions.checkNSFW(c.message).then(function (q) {
                    if (q) {
                      try {
                        commands[cmd].fn(c.message, suffix, bot)
                      } catch (e) {
                        c.message.channel.sendMessage(':warning: Oh no! I ran into an error. Please report this to my owner or wait for a further fix. \n```' + e + '```')
                        Logger.error(`Command error, thrown by ${commands[cmd].name}: ${e}`)
                      }
                    } else {
                      datacontrol.customize.reply(c.message, 'nsfw').then((d) => {
                        if (d === 'default') {
                          c.message.channel.sendMessage('I don\'t allow NSFW commands in this channel.')
                        } else {
                          c.message.channel.sendMessage(d.replace(/%user/g, c.message.author.mention).replace(/%server/g, c.message.guild.name).replace(/%channel/, c.message.channel.name))
                        }
                      }).catch((e) => {
                        Logger.error('Reply check error, ' + e)
                      })
                    }
                  }).catch(function (e) {
                    Logger.error('Permission error: ' + e)
                  })
                }
              } else {
                datacontrol.customize.reply(c.message, 'permissions').then((u) => {
                  if (u === 'default') {
                       if (r > -1 && !commands[cmd].hidden) {
                      var reason = (r > 4) ? '**This is a master user only command**, only my owner can use this command.' : 'If you want to level up, then ask to the server owner.'
                      c.message.channel.sendMessage(':no_entry_sign: Sorry, I can\'t let you use this command!\nLevel required: ' + commands[cmd].level + ', you have level ' + r + '\n' + reason)
                    }
                  } else {
                    c.message.channel.sendMessage(u.replace(/%user/g, c.message.author.mention).replace(/%server/g, c.message.guild.name).replace(/%channel/, c.message.channel.name).replace(/%nlevel/, commands[cmd].level).replace(/%ulevel/, r))
                  }
                }).catch((e) => {
                  Logger.error('Reply check error, ' + e)
                })
              }
            }).catch(function (e) {
              Logger.error('Permission error: ' + e)
            })
          }
        })
      } else {
        if (commands[cmd].noDM) {
          c.message.channel.sendMessage(':warning: Sorry, I can\'t use this command in DMs. Please invite me to a server and try again.')
          return
        }
        datacontrol.permissions.checkLevel(c.message, c.message.author.id, []).then(function (r) {
          if (r >= commands[cmd].level) {
            try {
              commands[cmd].fn(c.message, suffix, bot)
            } catch (e) {
              c.message.channel.sendMessage(':warning: Oh no! I ran into an error. Please report this to my owner or wait for a further fix. \n```' + e + '```')
              Logger.error(`Command error, thrown by ${commands[cmd].name}: ${e}`)
            }
          } else {
            c.message.channel.sendMessage(':warning: Sorry, you can\'t run this command in DM.')
          }
        }).catch(function (e) {
          Logger.error('Permission error: ' + e)
        })
      }
    }
  }).catch(function (e) {
    Logger.error('Prefix error: ' + e)
  })
})

bot.Dispatcher.on(Event.GUILD_MEMBER_ADD, function (s) {
  datacontrol.permissions.isKnown(s.guild)
  datacontrol.customize.isKnown(s.guild)
  datacontrol.customize.check(s.guild).then((r) => {
    if (r === 'on' || r === 'channel') {
      datacontrol.customize.reply(s, 'welcome').then((x) => {
        if (x === 'default') {
          s.guild.generalChannel.sendMessage(`Welcome ${s.member.username} to ${s.guild.name}! I hope you can enjoy your stay here ^-^`)
        } else {
          s.guild.generalChannel.sendMessage(x.replace(/%user/g, s.member.mention).replace(/%server/g, s.guild.name))
        }
      }).catch((e) => {
        Logger.error(e)
      })
    } else if (r === 'private') {
      datacontrol.customize.reply(s, 'welcome').then((x) => {
        if (x === 'default') {
          s.member.openDM().then((g) => g.sendMessage(`Welcome to ${s.guild.name}! I hope you can enjoy your stay here ^-^`))
        } else {
          s.member.openDM().then((g) => g.sendMessage(x.replace(/%user/g, s.member.mention).replace(/%server/g, s.guild.name)))
        }
      }).catch((e) => {
        Logger.error(e)
      })
    }
  }).catch((e) => {
    Logger.error(e)
  })
  datacontrol.users.isKnown(s.member)
})

bot.Dispatcher.on(Event.GUILD_CREATE, function (s) {
  if (!bot.connected) return
  if (!s.becameAvailable) {
    datacontrol.permissions.isKnown(s.guild)
    datacontrol.customize.isKnown(s.guild)
	setGame()
  }
})

bot.Dispatcher.on(Event.GUILD_DELETE, function (s) {
	setGame()
  })

bot.Dispatcher.on(Event.MESSAGE_CREATE, function (c) {
if (c.message.content == "(╯°□°）╯︵ ┻━┻" && c.message.guild.id !== '110373943822540800') {
	  c.message.channel.sendMessage('┬─┬﻿ ノ( ゜-゜ノ)')
   Logger.info(`Invoked tableflip trigger from ${c.message.author.username}#${c.message.author.discriminator}`)
  }
})

bot.Dispatcher.on(Event.GATEWAY_RESUMED, function () {
  Logger.info('Connection to the Discord gateway has been resumed.')
})

bot.Dispatcher.on(Event.PRESENCE_MEMBER_INFO_UPDATE, (user) => {
  datacontrol.users.isKnown(user.new).catch(() => {
    datacontrol.users.namechange(user.new).catch((e) => {
      Logger.error(e)
    })
  })
})

bot.Dispatcher.on(Event.VOICE_CHANNEL_LEAVE, function (e) {
  runtime.internal.voice.leaveRequired(bot, e.guildId)
})

bot.Dispatcher.on(Event.DISCONNECTED, function (e) {
  Logger.error('Disconnected from the Discord gateway: ' + e.error)
  if (!restarted) {
    restarted = true
    Logger.info('Trying to reconnect')
    start()
  } else {
    Logger.warn('OK, RIP! Please check your Internet connection and restart me.')
    process.exit(0)
  }
})

function setGame() {
bot.User.setStatus('online', {
name: `{config.settings.prefix}help | ${bot.Guilds.length} servers`
        })
}
		
function start() {
  try {
    Config = require('./config.json')
  } catch (e) {
    Logger.error('Config error: ' + e)
    process.exit(0)
  }
  if (Config.bot.isbot) {
    bot.connect({
      token: Config.bot.token
    })
  } else {
    bot.connect({
      email: Config.bot.email,
      password: Config.bot.password
    })
  }
}
