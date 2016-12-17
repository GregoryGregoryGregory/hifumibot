var Commands = []
var Logger = require('../../internal/logger.js').Logger
var Giphy = require('../../giphy.js')
var Cb = require('cleverbot-node')
var config = require('../../../config.json')
var unirest = require('unirest')
var cleverbot = new Cb()
Cb.prepare(function () {
  Logger.debug('Launched cleverbot')
})

//English -START-

Commands.gif = {
  name: 'gif',
  timeout: 10,
  level: 0,
  fn: function (msg, suffix) {
    var tags = suffix.split(' ')
    Giphy.get_gif(tags, function (id) {
      if (typeof id !== 'undefined') {
        msg.reply('http://media.giphy.com/media/' + id + '/giphy.gif [Tags: ' + tags + ']')
      } else {
        msg.reply('Invalid tags, try something else. [Tags: ' + tags + ']')
      }
    })
  }
}

Commands.rip = {
  name: 'rip',
  module: 'fun',
  timeout: 5,
  level: 0,
  fn: function (msg, suffix, bot) {
    var qs = require('querystring')
    var resolve = []
    var skipped = false
    if (msg.mentions.length > 0) {
      for (var m of msg.mentions) {
        if (m.id !== bot.User.id) {
          if (resolve[0] === undefined) {
            resolve[0] = m.username
          } else {
            resolve[0] += ' and ' + m.username
          }
        } else {
          skipped = true
        }
      }
    } else if (suffix) {
      resolve[0] = suffix
    }
    if (skipped === true && msg.mentions.length === 1 && suffix) {
      resolve[0] = suffix
    }
    msg.channel.sendMessage('<http://ripme.xyz/' + qs.stringify(resolve).substr(2) + '>')
  }
}

Commands.advice = {
  name: 'advice',
  noDM: true,
  timeout: 5,
  level: 0,
  fn: function (msg) {
    var request = require('request')
    request('http://api.adviceslip.com/advice', function (error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body)
        } catch (e) {
          msg.channel.sendMessage('Something wrong happened.')
          return
        }
        var advice = JSON.parse(body)
        msg.reply(':information_source: ' + advice.slip.advice)
      }
    })
  }
}

Commands.urban = {
  name: 'urban',
  timeout: 10,
  level: 0,
  fn: function (msg, suffix) {
    var request = require('request')
    request('http://api.urbandictionary.com/v0/define?term=' + suffix, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body)
        } catch (e) {
          msg.channel.sendMessage('Something wrong happened.')
          return
        }
        var uD = JSON.parse(body)
        if (uD.result_type !== 'no_results') {
          var msgArray = []
          msgArray.push('**' + uD.list[0].word + '**')
          msgArray.push(uD.list[0].definition)
          msgArray.push('\n```')
          msgArray.push(uD.list[0].example)
          msgArray.push('```')
          msg.channel.sendMessage(msgArray.join('\n'))
        } else {
          msg.reply(suffix + "\nWord not found.")
        }
      }
    })
  }
}

Commands.fact = {
  name: 'fact',
  timeout: 5,
  level: 0,
  fn: function (msg) {
    var request = require('request')
    var xml2js = require('xml2js')
    request('http://www.fayd.org/api/fact.xml', function (error, response, body) {
      if (error) {
        Logger.error(error)
      }
      if (!error && response.statusCode === 200) {
        xml2js.parseString(body, function (err, result) {
          if (err) {
            Logger.error(err)
          }
          try {
            msg.reply(result.facts.fact[0])
          } catch (e) {
            msg.channel.sendMessage(':no_entry_sign: Something went wrong.')
          }
        })
      }
    })
  }
}

Commands.dice = {
  name: 'dice',
  timeout: 5,
  level: 0,
  fn: function (msg, suffix) {
    var dice
    if (suffix) {
      dice = suffix
    } else {
      dice = 'd6'
    }
    var request = require('request')
    request('https://rolz.org/api/?' + dice + '.json', function (error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body)
        } catch (e) {
          msg.channel.sendMessage(':no_entry_sign: Something went wrong.')
          return
        }
        var roll = JSON.parse(body)
        msg.reply(':game_die: Your ' + roll.input + ' resulted in ' + roll.result + ' ' + roll.details)
      }
    })
  }
}

Commands.leetspeak = {
  name: 'leetspeak',
  level: 0,
  fn: function (msg, suffix) {
    if (suffix.length > 0) {
      var leetspeak = require('leetspeak')
      var thing = leetspeak(suffix)
      msg.reply('Original: ' + suffix + '\nResult: ' + thing)
    } else {
	msg.reply('You can\'t use this command with an empty text.')
    }
  }
}

Commands.talk = {
  name: 'talk',
  timeout: 0,
  level: 0,
fn: function (msg, suffix) {
	if (!suffix) {
     msg.channel.sendMessage(':speech_left: Yes?')
} else {	
     msg.channel.sendTyping()
    var type = setInterval(function () {
      msg.channel.sendTyping()
    }, 5000)
    cleverbot.write(suffix, function (r) {
      msg.channel.sendMessage(':speech_left: ' + r.message)
      clearInterval(type)
    })
  }
}
}

Commands.cutecat = {
  name: 'cutecat',
  timeout: 5,
  level: 0,
  fn: function (msg) {
	 var request = require('request')
	 request('http://random.cat/meow', function (error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body)
        } catch (e) {
          msg.channel.sendMessage(':no_entry_sign: Something went wrong.')
          return
        }
        var cat = JSON.parse(body)
        msg.reply(cat.file)
      }
    })
}
}

Commands.catfacts = {
  name: 'catfacts',
  timeout: 10,
  level: 0,
  fn: function (msg) {
    var request = require('request')
    request('http://catfacts-api.appspot.com/api/facts', function (error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body)
        } catch (e) {
          msg.channel.sendMessage(':no_entry_sign: Something went wrong.')
          return
        }
        var catFact = JSON.parse(body)
        msg.reply(catFact.facts[0])
      }
    })
  }
}

Commands.yesno = {
  name: 'yesno',
  timeout: 5,
  level: 0,
  fn: function (msg, suffix) {
    var request = require('request')
    request('http://yesno.wtf/api/?force=' + suffix, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body)
        } catch (e) {
          msg.channel.sendMessage(':no_entry_sign: Something went wrong.')
          return
        }
        var yesNo = JSON.parse(body)
        msg.reply(yesNo.image)
      }
    })
  }
}

Commands.e621 = {
  name: 'e621',
  timeout: 10,
  level: 0,
  nsfw: true,
  fn: function (msg, suffix) {
msg.channel.sendTyping()
    unirest.post(`https://e621.net/post/index.json?limit=30&tags=${suffix}`)
      .headers({
        'Accept': 'application/json',
        'User-Agent': 'Unirest Node.js'
      })
      .end(function (result) {
        if (result.body.length < 1) {
          msg.reply('Sorry, nothing found.')
  } else {
          var count = Math.floor((Math.random() * result.body.length))
          var FurryArray = []
          if (suffix) {
            FurryArray.push(msg.author.mention + ', your results for ' + suffix + '\n' + result.body[count].file_url)
          } else {
            FurryArray.push(msg.author.mention + ', your results for ' + suffix + '\n' + result.body[count].file_url)
          }
          msg.channel.sendMessage(FurryArray.join('\n'))
        }
      })
  }
}

Commands.rule34 = {
  name: 'rule34',
  timeout: 10,
  level: 0,
  nsfw: true,
  fn: function (msg, suffix) {
msg.channel.sendTyping()
    unirest.post('http://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=' + suffix) // Fetching 100 rule34 pics
      .end(function (result) {
        var xml2js = require('xml2js')
        if (result.body.length < 75) {
          msg.reply('Sorry, nothing found.')
        } else {
          xml2js.parseString(result.body, (err, reply) => {
            if (err) {
              msg.channel.sendMessage(':no_entry_sign: Something went wrong.')
            } else {
              var count = Math.floor((Math.random() * reply.posts.post.length))
              var FurryArray = []
              if (!suffix) {
                FurryArray.push(msg.author.mention + ", you didn\'t specified something so this is a random picture")
              } else {
                FurryArray.push(msg.author.mention + ", your resuls for " + suffix)
              }
              FurryArray.push('http:' + reply.posts.post[count].$.file_url)
              msg.channel.sendMessage(FurryArray.join('\n'))
            }
          })
        }
      })
  }
}

Commands.konachan = {
  name: 'konachan',
  timeout: 10,
  level: 0,
  nsfw: true,
  fn: function (msg, suffix) {
unirest.post(`https://konachan.com/post.json?limit=500&tags=${suffix}+%20order%3Ascore+%20rating:explicit`)
      .headers({
        'Accept': 'application/json',
        'User-Agent': 'Unirest Node.js'
      })
      .end(function (result) {
        if (result.body.length < 1) {
          msg.reply('Sorry, nothing found.') 
  } else {
          var count = Math.floor((Math.random() * result.body.length))
          var Konachan = []
          if (suffix) {
            Konachan.push(msg.author.mention + ', your results for ' + suffix)
          } else {
            Konachan.push(msg.author.mention + ', you didn\'t specified something so this is a random picture')
          }
          Konachan.push(result.body[count].file_url)
          msg.channel.sendMessage(Konachan.join('\n'))
        }
      })
  }
}

Commands.greenteaneko = {
  name: 'greenteaneko',
  timeout: 5,
  level: 0,
  nsfw: true,
  fn: function (msg, suffix) {
    var request = require('request')
    request('https://rra.ram.moe/i/r?type=nsfw-gtn&nsfw=true', function (error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body)
        } catch (e) {
          msg.channel.sendMessage(':no_entry_sign: Something went wrong.')
          return
        }
        var gtn = JSON.parse(body)
        msg.reply('https://rra.ram.moe' + gtn.path + '\nSupport the artist: ``https://www.patreon.com/collateralds``')
      }
    })
  }
}

Commands['8ball'] = {
  name: '8ball',
  module: 'fun',
  timeout: 5,
  level: 0,
  fn: function (msg, suffix) {
	      if (!suffix) {
      msg.channel.sendMessage('Please specify your question.')
      return
		  }
    var answers = [
	'It is certain',
	'It is decidedly so',
	'Without a doubt',
	'Yes, definitely',
	'You may rely on it',
	'As I see it, yes',
	'Most likely',
	'Outlook good',
	'Yes',
	'Sure',
	'Signs point to yes',
	'Reply hazy, try again',
	'Ask again later',
	'Better not tell you now',
	'Cannot predict now',
	'Concentrate and ask again',
	'Don\'t count on it',
	'My reply is no',
	'My sources say no',
	'Outlook not so good',
	'Very doubtful',
	'Who cares?'
    ]
    var answer = answers[Math.floor(Math.random() * answers.length)]
    msg.channel.sendMessage(':crystal_ball: ' + msg.author.mention + ', for your question: **' + suffix + '** :arrow_right: __' + answer + '__')
  }
}

Commands.roll = {
  name: 'roll',
  module: 'fun',
  timeout: 5,
  level: 0,
  fn: function (msg) {
    var answer = Math.floor((Math.random() * 100) + 1)
    msg.channel.sendMessage(':game_die: ' + msg.author.mention + ' rolled from 1 to 100 and got ' + answer)
  }
}

Commands.rps = {
  name: 'rps',
  module: 'fun',

  timeout: 3,
  level: 0,
  fn: function (msg, suffix) {
    var answers = [
      'rock',
	  'paper',
	  'scissors'
    ]
  if (suffix === 'Rock') {
    var answer = answers[Math.floor(Math.random() * answers.length)]
  msg.channel.sendMessage('I choose ' + answer)
    } else if (suffix === 'Paper') {
    var answer = answers[Math.floor(Math.random() * answers.length)]
  msg.channel.sendMessage('I choose ' + answer)
    } else if (suffix === 'Scissors') {
    var answer = answers[Math.floor(Math.random() * answers.length)]
  msg.channel.sendMessage('I choose ' + answer)
    } else if (suffix === 'rock') {
    var answer = answers[Math.floor(Math.random() * answers.length)]
  msg.channel.sendMessage('I choose ' + answer)
      } else if (suffix === 'paper') {
    var answer = answers[Math.floor(Math.random() * answers.length)]
  msg.channel.sendMessage('I choose ' + answer)
      } else if (suffix === 'scissors') {
    var answer = answers[Math.floor(Math.random() * answers.length)]
  msg.channel.sendMessage('I choose ' + answer)
 } else if (!suffix) {
      msg.channel.sendMessage('That\'s not a valid answer.')
} else {
      msg.channel.sendMessage('That\'s not a valid answer.')
}
  }
}


Commands.coinflip = {
  name: 'coinflip',
  module: 'fun',
  timeout: 5,
  level: 0,
  fn: function (msg) {
    var answers = [
      'heads',
	  'tails',
    ]
    var answer = answers[Math.floor(Math.random() * answers.length)]
  msg.channel.sendMessage(':moneybag: ' + msg.author.mention + ' flipped a coin and it landed on ' + answer)
  }
}
  
Commands.rate = {
  name: 'rate',
  module: 'fun',
  timeout: 5,
  level: 0,
  fn: function (msg, suffix, bot) {
	      if (!suffix) {
      msg.channel.sendMessage('Please specify who you want me to rate.')
      return
		  }
		      var answers = [
	  '0/10',
      '1/10',
	  '2/10',
	  '3/10',
	  '4/10',
	  '5/10',
	  '6/10',
	  '7/10',
	  '8/10',
	  '9/10',
	  '10/10'
    ]
    var answer = answers[Math.floor(Math.random() * answers.length)]
	if (msg.mentions.length === 1 && msg.mentions[0].id === bot.User.id) {
  msg.channel.sendMessage(':ok_hand: I\'ll rate myself a 10/10 because I\'m the best \:D/')
  } else if (suffix === '@everyone' || suffix === '@here') {
	  msg.channel.sendMessage(':joy: What the heck are you trying to do? No, thanks!')  
  } else {
  msg.channel.sendMessage(':ok_hand: ' + suffix + ' recieved a ' + answer + ' from me')
      }
}
}

Commands.choose = {
  name: 'choose',
  module: 'fun',
  timeout: 3,
  level: 0,
  fn: function (msg, suffix) {
        if (!suffix || suffix.split(", ").length < 2) {
			msg.channel.sendMessage(":no_entry_sign: Something went wrong, try again. Remember to separate options with a comma and input 2 options or more.")
        } else {
            let choices = suffix.split(", ");
            msg.channel.sendMessage(":thinking: " + msg.author.username + ", if I had to choose the best option, I would pick " + choices[Math.floor(Math.random() * (choices.length))] + ".").catch();
        }
    }
}

Commands.slap = {
  name: 'slap',
  noDM: true,
  level: 0,
  timeout: 5,
  fn: function (msg, suffix, bot) {
	  if (!suffix) {
		  msg.channel.sendMessage(':anger: You can\'t slap nobody!')
  } else if (msg.mentions.length === 1 && msg.mentions[0].id === bot.User.id) {
  msg.channel.sendMessage(':anger: ' + msg.author.mention + ' slapped ' + suffix + '! Now it has its cheek purple.')
  msg.channel.sendMessage(':anger: **BUT** ' + bot.User.username + ' slaps ' + msg.author.mention + ' back and attacks with a laser beam, now it\'s in the hospital recovering health and regretting of this very deeply.')
  msg.reply('ggwp')
  } else if (msg.mentions.length === 1 && msg.mentions[0].id === msg.author.id) {
  msg.channel.sendMessage(':anger: ' + msg.author.mention + ' slapped him(her)self! Now it has its cheek purple.')
  } else if (suffix === '@everyone' || suffix === '@here') {
	  msg.channel.sendMessage(':anger: What?') 
  } else {
      msg.channel.sendMessage(':anger: ' + msg.author.mention + ' slapped ' + suffix + '! Now it has his/her cheek purple. Baka!')
    }
}
}

Commands.triggered = {
  name: 'triggered',
  level: 0,
  timeout: 5,
  fn: function (msg, suffix) {
    var request = require('request')
    request('https://rra.ram.moe/i/r?type=triggered', function (error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body)
        } catch (e) {
          msg.channel.sendMessage(':no_entry_sign: Something went wrong.')
          return
        }
        var trig = JSON.parse(body)
        msg.reply('https://rra.ram.moe' + trig.path)
      }
    })
  }
}

exports.Commands = Commands