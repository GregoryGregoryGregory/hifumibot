'use strict'
var v = require('../../internal/voice.js')
var Commands = []

Commands.music = {
  name: 'music',
  noDM: true,
  timeout: 10,
  level: 0,
  fn: function (msg, suffix, bot) {
    v.music(msg, suffix, bot)
  }
}

Commands.volume = {
  name: 'volume',
  noDM: true,
  timeout: 10,
  level: 0,
  fn: function (msg, suffix, bot) {
    v.volume(msg, suffix, bot)
  }
}

Commands.skip = {
  name: 'skip',
  noDM: true,
  timeout: 5,
  level: 0,
  fn: function (msg, suffix, bot) {
    v.voteSkip(msg, bot)
  }
}

Commands.shuffle = {
  name: 'shuffle',
  noDM: true,
  timeout: 10,
  level: 1,
  fn: function (msg) {
    v.shuffle(msg)
    msg.reply(':revolving_hearts: Playlist has been successfully shuffled.')
  }
}

Commands['shutdown'] = {
  name: 'shutdown',
  noDM: true,
  timeout: 10,
  level: 1,
  fn: function (msg, suffix, bot) {
    v.leave(msg, suffix, bot)
  }
}

Commands.forceskip = {
  name: 'forceskip',
  noDM: true,
  timeout: 10,
  level: 1,
  fn: function (msg, suffix, bot) {
    v.skip(msg, suffix, bot)
  }
}

Commands.playlist = {
  name: 'playlist',
  noDM: true,
  timeout: 10,
  level: 0,
  fn: function (msg) {
    v.fetchList(msg).then((r) => {
      var arr = []
      arr.push(':arrow_forward: Now playing: **' + r.info[0] + '** \n')
      for (var i = 1; i < r.info.length; i++) {
        arr.push((i + 1) + '. **' + r.info[i] + '** Requested by ' + r.requester[i])
        if (i === 9) {
          arr.push('And about ' + (r.info.length - 10) + ' more songs.')
          break
        }
      }
      msg.channel.sendMessage(arr.join('\n')).then((m) => {
        setTimeout(() => {
          m.delete()
        }, 15000)
      })
    }).catch(() => {
      msg.channel.sendMessage(":information_source: It appears that there aren't any songs in the current queue. ¯\_(ツ)_/¯")
    })
  }
}

Commands.startmusic = {
  name: 'startmusic',
  noDM: true,
  timeout: 10,
  level: 0,
  fn: function (msg, suffix, bot) {
    v.join(msg, suffix, bot)
  }
}

Commands.request = {
  name: 'request',
  noDM: true,
  usage: 'link',
  timeout: 10,
  level: 0,
  fn: function (msg, suffix, bot) {
    var u = require('url').parse(suffix)
    if (u.host === null) {
      msg.channel.sendMessage(":no_entry_sign: That's not how you do it, you need to enter a link to a file for me to play.")
    } else {
      v.request(msg, suffix, bot)
    }
  }
}

exports.Commands = Commands
