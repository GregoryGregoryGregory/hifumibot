var list = {}
var time = {}
var status = {}
var requestLink = {}
var splitLink = {}
var temp
var DL = require('ytdl-core')
var YT = require('youtube-dl')
var Logger = require('./logger.js').Logger
var Config = require('../../config.json')

exports.join = function (msg, suffix, bot) {
  if (bot.VoiceConnections.length > config.settings.musiclimit) {
    msg.channel.sendMessage(':no_entry_sign: Error while starting up my music system. All streaming slots are taken! Try again later. :cry:')
  } else {
    var voiceCheck = bot.VoiceConnections.find((r) => r.voiceConnection.guild.id === msg.guild.id)
    if (!voiceCheck && !suffix) {
      var VC = msg.member.getVoiceChannel()
      if (VC) {
        VC.join().then((vc) => {
          var prefix = Config.settings.prefix
          require('../datacontrol.js').customize.prefix(msg).then((r) => {
            if (r !== false) prefix = r
          })
          var joinmsg = []
          joinmsg.push(`Welcome to music jukebox, now playing in **${vc.voiceConnection.channel.name}** which you're currently connected to.`)
          joinmsg.push(`You have 10 minutes to decide something while this waiting music plays, otherwise I'll shut down automatically.`)
          joinmsg.push(`__**Music Commands**__`)
          joinmsg.push(`**${prefix}request** - *I will play a song for you, use a link from YouTube, Soundcloud or a mp3 uploaded file*`)
          joinmsg.push(`**${prefix}music pause** - *The current song will be paused if it's playing.*`)
          joinmsg.push(`**${prefix}music play** - *The current song will be resumed if it's paused.*`)
          joinmsg.push(`**${prefix}volume** - *Change the volume of the current song.*`)
          joinmsg.push(`**${prefix}playlist** - *List upcoming requested songs. Hifumi will show this in order.*`)
          joinmsg.push(`**${prefix}shuffle** - *Shuffle the music playlist and songs will be played in random order.*`)
          joinmsg.push(`**${prefix}skip** - *Vote to skip the current song if you don't like it.*`)
          joinmsg.push(`**${prefix}forceskip** - *Force skip the current song.*`)
          joinmsg.push(`**${prefix}shutdown** - *I will no longer play music in the voice channel.*`)
          msg.channel.sendMessage(joinmsg.join('\n'))
          status[msg.guild.id] = true
          time[msg.guild.id] = setTimeout(function () {
            leave(bot, msg)
            status[msg.guild.id] = false
          }, 660000)
          waiting(vc)
        }).catch((err) => {
          if (err.message === 'Missing permission') {
            msg.reply(":warning: You want me to stream music but you didn't set me ''Connect'' permissions. That doesn't have any sense, you know?")
          }
        })
      } else if (!VC) {
        msg.guild.voiceChannels[0].join().then((vc) => {
          var prefix = Config.settings.prefix
          require('../datacontrol.js').customize.prefix(msg).then((r) => {
            if (r !== false) prefix = r
          })
          var joinmsg = []
          joinmsg.push(`Welcome to music jukebox, now playing in **${vc.voiceConnection.channel.name}** because you didn't specify a voice channel for joining.`)
          joinmsg.push(`You have 10 minutes to decide something while this waiting music plays, otherwise I'll shut down automatically.`)
          joinmsg.push(`__**Music Commands**__`)
          joinmsg.push(`**${prefix}request** - *I will play a song for you, use a link from YouTube, Soundcloud or a mp3 uploaded file*`)
          joinmsg.push(`**${prefix}music pause** - *The current song will be paused if it's playing.*`)
          joinmsg.push(`**${prefix}music play** - *The current song will be resumed if it's paused.*`)
          joinmsg.push(`**${prefix}volume** - *Change the volume of the current song.*`)
          joinmsg.push(`**${prefix}playlist** - *List upcoming requested songs. Hifumi will show this in order.*`)
          joinmsg.push(`**${prefix}shuffle** - *Shuffle the music playlist and songs will be played in random order.*`)
          joinmsg.push(`**${prefix}skip** - *Vote to skip the current song if you don't like it.*`)
          joinmsg.push(`**${prefix}forceskip** - *Force skip the current song.*`)
          joinmsg.push(`**${prefix}shutdown** - *I will no longer play music in the voice channel.*`)
          msg.channel.sendMessage(joinmsg.join('\n'))
          status[msg.guild.id] = true
          time[msg.guild.id] = setTimeout(function () {
            leave(bot, msg)
            status[msg.guild.id] = false
          }, 660000)
          waiting(vc)
        }).catch((err) => {
          if (err.message === 'Missing permission') {
            msg.reply(":warning: You want me to stream music but you didn't set me ''Connect'' permissions. That doesn't have any sense, you know?")
          }
        })
      }
    } else if (!voiceCheck) {
      msg.channel.guild.voiceChannels
        .forEach((channel) => {
          if (channel.name.toLowerCase().indexOf(suffix.toLowerCase()) >= 0) {
            channel.join().then((vc) => {
              var prefix = Config.settings.prefix
              require('../datacontrol.js').customize.prefix(msg).then((r) => {
                if (r !== false) prefix = r
              })
              var joinmsg = []
              joinmsg.push(`Welcome to music jukebox, now playing in **${vc.voiceConnection.channel.name}**.`)
              joinmsg.push(`You have 10 minutes to decide something while this waiting music plays, otherwise I'll shut down automatically.`)
              joinmsg.push(`__**Music Commands**__`)
              joinmsg.push(`**${prefix}request** - *I will play a song for you, use a link from YouTube, Soundcloud or a mp3 uploaded file*`)
              joinmsg.push(`**${prefix}music pause** - *The current song will be paused if it's playing.*`)
              joinmsg.push(`**${prefix}music play** - *The current song will be resumed if it's paused.*`)
              joinmsg.push(`**${prefix}volume** - *Change the volume of the current song.*`)
              joinmsg.push(`**${prefix}playlist** - *List upcoming requested songs. Hifumi will show this in order.*`)
              joinmsg.push(`**${prefix}shuffle** - *Shuffle the music playlist and songs will be played in random order.*`)
              joinmsg.push(`**${prefix}skip** - *Vote to skip the current song if you don't like it.*`)
              joinmsg.push(`**${prefix}forceskip** - *Force skip the current song.*`)
              joinmsg.push(`**${prefix}shutdown** - *I will no longer play music in the voice channel.*`)
              msg.channel.sendMessage(joinmsg.join('\n'))
              status[msg.guild.id] = true
              time[msg.guild.id] = setTimeout(function () {
                leave(bot, msg)
                status[msg.guild.id] = false
              }, 660000)
              waiting(vc)
            }).catch((err) => {
              if (err.message === 'Missing permission') {
                msg.reply(':warning: You want me to stream music but you didn\'t set me "Connect" permissions. That doesn\'t have any sense, you know?')
              }
            })
          }
        })
    } else {
      msg.reply(':warning: I\'m already streaming music on this voice channel :arrow_right: ' + voiceCheck.voiceConnection.channel.name).then((m) => {
        setTimeout(() => {
          m.delete().catch((e) => Logger.error(e))
        }, 10000)
      })
    }
  }
}

function leave (bot, msg) {
  if (status[msg.guild.id] === true) {
    msg.channel.sendMessage(':wave: The waiting has timed out. Music jukebox has been shut down! Bye bye ^-^')
    var voice = bot.VoiceConnections.find((r) => r.voiceConnection.guild.id === msg.guild.id)
    if (voice) {
      voice.voiceConnection.getEncoder().kill()
      voice.voiceConnection.disconnect()
      delete list[msg.guild.id]
    }
  }
}

exports.leave = function (msg, suffix, bot) {
  clearTimeout(time[msg.guild.id])
  var voice = bot.VoiceConnections.find((r) => r.voiceConnection.guild.id === msg.guild.id)
  if (voice) {
    voice.voiceConnection.getEncoder().kill()
    voice.voiceConnection.disconnect()
    delete list[msg.guild.id]
  }
}

function waiting (vc) {
  var waitMusic = vc.voiceConnection.createExternalEncoder({
    type: 'ffmpeg',
    source: 'placeholder.mp3',
    format: 'pcm'
  })
  waitMusic.play()
}

function next (msg, suffix, bot) {
  clearTimeout(time[msg.guild.id])
  bot.VoiceConnections
    .map((connection) => {
      if (connection.voiceConnection.guild.id === msg.guild.id) {
        if (list[msg.guild.id].link.length === 0) {
          delete list[msg.guild.id]
          msg.channel.sendMessage(':wave: I didn\'t find something more to play. Music jukebox has been shut down! Bye bye ^-^')
          connection.voiceConnection.disconnect()
          return
        }
        if (list[msg.guild.id].link[0] === 'INVALID') {
          list[msg.guild.id].link.shift()
          list[msg.guild.id].info.shift()
          list[msg.guild.id].requester.shift()
          list[msg.guild.id].skips.count = 0
          list[msg.guild.id].skips.users = []
        }
        var encoder = connection.voiceConnection.createExternalEncoder({
          type: 'ffmpeg',
          format: 'pcm',
          source: list[msg.guild.id].link[0]
        })
        encoder.play()
        var vol = (list[msg.guild.id].volume !== undefined) ? list[msg.guild.id].volume : 100
        connection.voiceConnection.getEncoder().setVolume(vol)
        encoder.once('end', () => {
          msg.channel.sendMessage(':musical_score: Track finished: ' + list[msg.guild.id].info[0]).then((m) => {
            setTimeout(() => {
              m.delete().catch((e) => Logger.error(e))
            }, 3000)
          })
          list[msg.guild.id].link.shift()
          list[msg.guild.id].info.shift()
          list[msg.guild.id].requester.shift()
          list[msg.guild.id].skips.count = 0
          list[msg.guild.id].skips.users = []
          if (list[msg.guild.id].link.length > 0) {
            msg.channel.sendMessage(':musical_score: Next up: ' + list[msg.guild.id].info[0] + ', song requested by ' + list[msg.guild.id].requester[0]).then((m) => {
              setTimeout(() => {
                m.delete().catch((e) => Logger.error(e))
              }, 10000)
            })
            next(msg, suffix, bot)
          } else {
            msg.channel.sendMessage(':wave: I didn\'t find something more to play. Music jukebox has been shut down! Bye bye ^-^').then((m) => {
              setTimeout(() => {
                m.delete().catch((e) => Logger.error(e))
              }, 10000)
            })
            connection.voiceConnection.disconnect()
          }
        })
      }
    })
}

exports.shuffle = function (msg) {
  var currentIndex = list[msg.guild.id].link.length
  var temporaryValue
  var randomIndex
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    if (currentIndex !== 0 && randomIndex !== 0) {
      temporaryValue = list[msg.guild.id].link[currentIndex]
      list[msg.guild.id].link[currentIndex] = list[msg.guild.id].link[randomIndex]
      list[msg.guild.id].link[randomIndex] = temporaryValue
      temporaryValue = list[msg.guild.id].info[currentIndex]
      list[msg.guild.id].info[currentIndex] = list[msg.guild.id].info[randomIndex]
      list[msg.guild.id].info[randomIndex] = temporaryValue
      temporaryValue = list[msg.guild.id].requester[currentIndex]
      list[msg.guild.id].requester[currentIndex] = list[msg.guild.id].requester[randomIndex]
      list[msg.guild.id].requester[randomIndex] = temporaryValue
    }
  }
}

exports.voteSkip = function (msg, bot) {
  var connect = bot.VoiceConnections
    .filter(function (connection) {
      return connection.voiceConnection.guild.id === msg.guild.id
    })
  if (connect.length < 1) {
    msg.reply(':no_entry_sign: Something wrong happened. Error: No connection.')
  } else if (list[msg.guild.id] === undefined) {
    msg.reply(':information_source: Try requesting a song first before voting to skip.')
  } else if (msg.member.getVoiceChannel().id !== connect[0].voiceConnection.channel.id) {
    msg.reply(':ballot_box: You\'re not allowed to vote because you\'re not in the voice channel.')
  } else {
    var count = Math.round((connect[0].voiceConnection.channel.members.length - 2) / 2)
    if (list[msg.guild.id].skips.users.indexOf(msg.author.id) > -1) {
      msg.reply(':ballot_box: You can\'t vote for a song skipping more than 2 times.')
    } else {
      list[msg.guild.id].skips.users.push(msg.author.id)
      list[msg.guild.id].skips.count++
      if (list[msg.guild.id].skips.count >= count) {
        msg.channel.sendMessage(':ballot_box_with_check: Song successfully skipped, next song coming up!')
        exports.skip(msg, null, bot)
      } else {
        msg.reply(`:hourglass: Vote for skip registered, ${count - list[msg.guild.id].skips.count} more votes needed for the vote to pass.`)
      }
    }
  }
}

exports.volume = function (msg, suffix, bot) {
  if (!isNaN(suffix) && suffix <= 100 && suffix > 0) {
    bot.VoiceConnections
      .map((connection) => {
        if (connection.voiceConnection.guild.id === msg.guild.id) {
          if (list[msg.guild.id] === undefined) {
            msg.reply(':loud_sound: Wait until I receive a song request, then try to adjust volume again. Note that waiting music does not work with volume command.')
            return
          }
          list[msg.guild.id].volume = parseInt(suffix)
          connection.voiceConnection.getEncoder().setVolume(suffix)
        }
      })
  } else {
    msg.channel.sendMessage(':loud_sound: I can accept volume from 0 to 100 percent only.')
  }
}

exports.skip = function (msg, suffix, bot) {
  list[msg.guild.id].link.shift()
  list[msg.guild.id].info.shift()
  list[msg.guild.id].requester.shift()
  list[msg.guild.id].skips.count = 0
  list[msg.guild.id].skips.users = []
  next(msg, suffix, bot)
}

exports.music = function (msg, suffix, bot) {
  bot.VoiceConnections
    .map((connection) => {
      if (connection.voiceConnection.guild.id === msg.guild.id) {
        if (suffix.toLowerCase() === 'pause') {
          connection.voiceConnection.getEncoderStream().cork()
        } else if (suffix.toLowerCase() === 'play') {
          connection.voiceConnection.getEncoderStream().uncork()
        } else {
          msg.channel.sendMessage(':question: I can\'t understand you. Please use: ~music play or ~music pause')
        }
      }
    })
}

exports.fetchList = function (msg) {
  return new Promise(function (resolve, reject) {
    try {
      resolve(list[msg.guild.id])
    } catch (e) {
      reject(e)
    }
  })
}

exports.request = function (msg, suffix, bot) {
  var connect = bot.VoiceConnections
    .filter(function (connection) {
      return connection.voiceConnection.guild.id === msg.guild.id
    })
  if (connect.length < 1) {
    msg.channel.sendMessage(":information_source: Please start up Hifumi's music jukebox first to request a song.")
    return
  }
  var link = require('url').parse(suffix)
  var query = require('querystring').parse(link.query)
  msg.channel.sendTyping()
  if (suffix.includes('list=') !== suffix.includes('playlist?')) {
    requestLink[msg.guild.id] = suffix
    if (suffix.includes('youtu.be')) { // If the link is shortened with youtu.be
      splitLink[msg.guild.id] = requestLink[msg.guild.id].split('?list=') // Check for this instead of &list
      msg.channel.sendMessage(`:warning: Try that again with a video or playlist link you want me to play.
**Video:** <${splitLink[msg.guild.id][0]}>
**Playlist:** <https://www.youtube.com/playlist?list=${splitLink[msg.guild.id][1]}>`)
    } else {
      splitLink[msg.guild.id] = requestLink[msg.guild.id].split('&list=')
      msg.channel.sendMessage(`:warning: Try that again with a video or playlist link you want me to play.
**Video:** <${splitLink[msg.guild.id][0]}>
**Playlist:** <https://www.youtube.com/playlist?list=${splitLink[msg.guild.id][1]}>`)
    }
  } else if (query.list && query.list.length > 8 && link.host.indexOf('youtu') > -1) {
    msg.channel.sendMessage(':hourglass: Now Loading!!!! Please wait...')
    var api = require('youtube-api')
    api.authenticate({
      type: 'key',
      key: Config.api_keys.google
    })
    api.playlistItems.list({
      part: 'snippet',
      pageToken: [],
      maxResults: 50,
      playlistId: query.list
    }, function (err, data) {
      if (err) {
        msg.channel.sendMessage(':warning: Whoops, something got wrong while proccesing playlist information. Try again later.').then((m) => {
          setTimeout(() => {
            m.delete().catch((e) => Logger.error(e))
          }, 10000)
        })
        Logger.error('Playlist failure, ' + err)
        return
      } else if (data) {
        temp = data.items
        safeLoop(msg, suffix, bot)
      }
    })
  } else {
    fetch(suffix, msg).then((r) => {
      msg.channel.sendMessage(`:white_check_mark: Succesfully added: ${r.title}`).then((m) => {
        setTimeout(() => {
          m.delete().catch((e) => Logger.error(e))
        }, 10000)
      })
      if (r.autoplay === true) {
        next(msg, suffix, bot)
      }
    }).catch((e) => {
      Logger.error(e)
      msg.channel.sendMessage(":no_entry_sign: Sorry, but I can't access to the song you want to play. You should request songs that are available worldwide.").then((m) => {
        setTimeout(() => {
          m.delete().catch((e) => Logger.error(e))
        }, 10000)
      })
    })
  }
}

exports.leaveRequired = function (bot, guild) {
  var connect = bot.VoiceConnections
    .find(function (connection) {
      connection.voiceConnection.guild.id === guild
    })
  if (connect) {
    if (connect.voiceConnection.channel.members.length <= 1) {
      delete list[guild.id]
      connect.voiceConnection.disconnect()
    }
  }
}

function fetch (v, msg, stats) {
  return new Promise(function (resolve, reject) {
    var x = 0
    var y = 1
    if (stats) {
      x = stats
    }
    var options
    if (v.indexOf('youtu') > -1) {
      options = ['--skip-download', '--add-header', 'Authorization:' + Config.api_keys.google]
    } else {
      options = ['--skip-download']
    }
    YT.getInfo(v, options, function (err, i) {
      if (!err && i) {
        y++
        if (list[msg.guild.id] === undefined || list[msg.guild.id].link.length < 1) {
          list[msg.guild.id] = {
            link: [i.url],
            info: [i.title],
            volume: 100,
            requester: [msg.author.username],
            skips: {
              count: 0,
              users: []
            }
          }
          if (y > x) {
            return resolve({
              title: i.title,
              autoplay: true,
              done: true
            })
          } else {
            return resolve({
              title: i.title,
              autoplay: true
            })
          }
        } else {
          list[msg.guild.id].link.push(i.url)
          list[msg.guild.id].info.push(i.title)
          list[msg.guild.id].requester.push(msg.author.username)
          if (y > x) {
            return resolve({
              title: i.title,
              autoplay: false,
              done: true
            })
          } else {
            return resolve({
              title: i.title,
              autoplay: false
            })
          }
        }
      } else if (err) {
        y++
        if (y > x) {
          return reject({
            error: err,
            done: true
          })
        } else {
          return reject({
            error: err
          })
        }
      }
    })
  })
}

function safeLoop (msg, suffix, bot) {
  if (temp.length === 0) {
    msg.channel.sendMessage(':white_check_mark: Done fetching the playlist')
  } else {
    DLFetch(temp[0], msg, suffix, bot).then((f) => {
      if (f) {
        msg.channel.sendMessage(`:musical_score: Autoplaying ${list[msg.guild.id].info[0]}`)
        next(msg, suffix, bot)
      }
      temp.shift()
      safeLoop(msg, suffix, bot)
    }, () => {
      temp.shift()
      safeLoop(msg, suffix, bot)
    })
  }
}

function DLFetch (video, msg) {
  return new Promise(function (resolve, reject) {
    var first = false
    DL.getInfo('https://youtube.com/watch?v=' + video.snippet.resourceId.videoId, {
      quality: 140
    }, (err, i) => {
      if (!err && i) {
        if (list[msg.guild.id] === undefined || list[msg.guild.id].link.length < 1) {
          list[msg.guild.id] = {
            link: [],
            info: [],
            volume: 100,
            requester: [],
            skips: {
              count: 0,
              users: []
            }
          }
          first = true
        }
        list[msg.guild.id].link.push(i.formats[0].url)
        list[msg.guild.id].info.push(i.title)
        list[msg.guild.id].requester.push(msg.author.username)
        return resolve(first)
      } else {
        Logger.debug('Playlist debug, ' + err)
        return reject(first)
      }
    })
  })
}