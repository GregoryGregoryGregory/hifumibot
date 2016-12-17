'use strict'
var v = require('../../internal/voice.js')
var Commands = []
var config = require('../../../config.json')

Commands.youtube = {
  name: 'youtube',
  level: 0,
  timeout: 5,
  fn: function (msg, suffix, bot) {
	  if (suffix.includes('youtube.com')) {
		msg.reply(':no_entry_sign: That not how this works! This command is made for searching YouTube videos, not for requesting videos to be played. Use ``' + config.settings.prefix + 'request link`` instead.')  
	  } else if (suffix) {
    var request = require('request')
    request('https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + suffix.replace(" ","+") + '&maxResults=1&key=AIzaSyD-Zy5VXroyzHx4HEqTYWs4xXzZjXiBKt0', function (error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body)
        } catch (e) {
          msg.channel.sendMessage(':no_entry_sign: Something went wrong.')
          return
        }
        var yt = JSON.parse(body).items.map (function (item) {
        var link = ''
        var id = ''
        var result = 'https://www.youtube.com/watch?v=' + item.id.videoId
        msg.reply(JSON.stringify(result) + '\n\nTo play this song on jukebox queue, copy this link without quotes and use ``' + config.settings.prefix + 'request link`` (replace the word "link" with the video link)\n**NOTE:** This is the first YouTube result, results can\'t maybe be accurate with your choice.')
		})
      } else if (response.statusCode === 404) {
	  msg.channel.sendMessage(':no_entry_sign: Sorry, nothing found.')
	  }
    })
  } else {
msg.channel.sendMessage(':warning: Please specify something you want to search.')	  
} 
}
}


Commands.song = {
  name: 'song',
  noDM: true,
  timeout: 10,
  level: 0,
  fn: function (msg, suffix, bot) {
    v.music(msg, suffix, bot)
  }
}

Commands.music = {
  name: 'music',
  noDM: true,
  timeout: 10,
  level: 0,
  fn: function (msg, suffix, bot) {
    v.join(msg, suffix, bot)
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

Commands.shutdown = {
  name: 'shutdown',
  noDM: true,
  timeout: 10,
  level: 0,
  fn: function (msg, suffix, bot) {
    v.leave(msg, suffix, bot)
	msg.channel.sendMessage(':wave: Music jukebox has been shut down by ' + msg.author.username + '\'s request! Bye bye ^-^')
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
      msg.channel.sendMessage(arr.join('\n'))
    }).catch(() => {
      msg.channel.sendMessage(':information_source: It appears that there aren\'t any songs in the current queue. ¯\\_(ツ)_/¯')
    })
  }
}

Commands.request = {
  name: 'request',
  noDM: true,
  timeout: 10,
  level: 0,
  fn: function (msg, suffix, bot) {
    var u = require('url').parse(suffix)
    if (u.host === null) {
      msg.channel.sendMessage(":no_entry_sign: That's not how you do it, you need to enter a link to a file for me to play. To search something to queue, use ``" + config.settings.prefix + "youtube searchkeys``.")
    } else {
      v.request(msg, suffix, bot)
    }
  }
}

Commands.listenmoe = {
  name: 'listenmoe',
  noDM: true,
  timeout: 10,
  level: 0,
  fn: function (msg, suffix, bot) {
     v.listenmoe(msg, suffix, bot)
    }
}

Commands['radio'] = {
  name: 'radio',
  noDM: true,
  timeout: 10,
  level: 0,
fn: function (msg, suffix, bot) {
if (suffix == 'help') {
	msg.channel.sendMessage(`**How do I find the raw stream link?**

Please note, this may not work for all streams.
Credits to Jay 哥哥 (🌸 ◕‿◕)#6675 for the original tutorial.

1. Right click anywhere on the site of the stream you want to find the raw stream link and inspect the element. You can also press F12 on your keyboard. This will open the DevTools Overview. REFRESH THE PAGE RIGHT AFTER
(THIS IS CHROME BUT SHOULD STILL WORK ON MOST BROWSERS)
2. Now find the Network tab.
3. Look for the timeline that is constantly growing/moving. Make sure the stream is playing music otherwise it may not grow/move.
4. Right click the line and copy the link address

So, once you're done with everything, just paste the link into ${config.settings.prefix}radio link (replace link with the link of course).

The picture below is an example and can enlarged if you click the image and click the little "Open Original" on the bottom left. http://puu.sh/sCupH.jpg`)
} else {
     v.playradio(msg, suffix, bot)
    }
}
}

exports.Commands = Commands
