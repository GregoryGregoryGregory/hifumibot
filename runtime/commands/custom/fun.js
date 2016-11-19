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
  fn: function (msg, suffix) {
  msg.channel.sendMessage('http://www.tombstonebuilder.com/generate.php?top1=&top2=Rest+in+peace&top3=' + suffix.replace(" ", "+") + '&top4=&sp=')
}
}

Commands.advice = {
  name: 'advice',
  noDM: true, // Ratelimits Ratelimits Ratelimits Ratelimits
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
          msg.reply(suffix + ": ERROR 404: Urban Dictionary doesn't have this word on the database.")
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
            msg.channel.sendMessage(':x: Something went wrong.')
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
          msg.channel.sendMessage(':x: Something went wrong.')
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
    unirest.get('https://nijikokun-random-cats.p.mashape.com/random')
      .header('X-Mashape-Key', config.api_keys.mashape)
      .header('Accept', 'application/json')
      .end(function (result) {
        try {
          msg.reply(result.body.source)
        } catch (e) {
          Logger.error(e)
          msg.reply(':x: Something went wrong.')
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
          msg.channel.sendMessage(':x: Something went wrong.')
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
          msg.channel.sendMessage(':x: Something went wrong.')
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
  usage: '<tags> multiword tags need to be typed like: wildbeast_is_a_discord_bot',
  level: 0,
  nsfw: true,
  fn: function (msg, suffix) {
	  if (suffix === 'hifumi') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === 'hifumi takimoto') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === 'hifumi new game') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === 'takimoto hifumi') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === 'hifumi nyu gemu') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === 'h1fum1') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === 't4k1m0t0 h1fum1') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === 'hifumin') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === 'HIFUMI') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === 'HIFUMI TAKIMOTO') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === 'HIFUMI NEW GAME') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === 'TAKIMOTO HIFUMI') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === 'HIFUMI NEW GAME') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === 'HIFUMI NYU GEMU') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === 'H1FUM1') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === 'T4K1M0T0 H1FUM1') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === 'HIFUMIN') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === '滝本 ひふみ') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === '滝本ひふみ') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === '滝本 ひふみ ニューゲーム') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === '滝本ひふみ ニューゲーム') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === 'ひふみ') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === 'ひふみん') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === '滝本ひふみん') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === '滝本ひふみん ニューゲーム') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === '滝本ひふみん NEW GAME') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === 'NEW GAME 滝本ひふみん') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === 'NEW GAME 滝本ひふみ') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === '滝本Hifumi') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === '滝本 Hifumi') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === 'Takimoto ひふみ') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === 'Takimoto ひふみん') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === 'Underforest') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else if (suffix === 'underforest') {
  msg.channel.sendMessage(':anger: YOU WON\'T SEARCH THAT! https://67.media.tumblr.com/bba13c2f1c0f13c1c8619f78519f8713/tumblr_ocasr1G9NO1s21xzoo1_500.gif')
  } else {
    msg.channel.sendTyping()
    unirest.post(`https://e621.net/post/index.json?limit=30&tags=${suffix}`)
      .headers({
        'Accept': 'application/json',
        'User-Agent': 'Unirest Node.js'
      })
      // Fetching 30 posts from E621 with the given tags
      .end(function (result) {
        if (result.body.length < 1) {
          msg.reply('Sorry, nothing found.') // Correct me if it's wrong.
  } else {
          var count = Math.floor((Math.random() * result.body.length))
          var FurryArray = []
          if (suffix) {
            FurryArray.push(`${msg.author.mention}` + '`, your results for `' + suffix + '`')
          } else {
            FurryArray.push(`${msg.author.mention}` + ', you didn\'t specified something so this is a random picture')
          } // hehe no privacy if you do the nsfw commands now.
          FurryArray.push(result.body[count].file_url)
          msg.channel.sendMessage(FurryArray.join('\n'))
        }
      })
  }
}
}

Commands.rule34 = {
  name: 'rule34',
  level: 0,
  nsfw: true,
  fn: function (msg, suffix) {
    msg.channel.sendTyping()
    unirest.post('http://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=' + suffix) // Fetching 100 rule34 pics
      .end(function (result) {
        var xml2js = require('xml2js')
        if (result.body.length < 75) {
          msg.reply('Sorry, nothing found.') // Correct me if it's wrong.
        } else {
          xml2js.parseString(result.body, (err, reply) => {
            if (err) {
              msg.channel.sendMessage(':x: Something went wrong.')
            } else {
              var count = Math.floor((Math.random() * reply.posts.post.length))
              var FurryArray = []
              if (!suffix) {
                FurryArray.push(msg.author.mention + ", you didn\'t specified something so this is a random picture")
              } else {
                FurryArray.push(msg.author.mention + ", your resuls for `" + suffix + '`')
              }
              FurryArray.push('http:' + reply.posts.post[count].$.file_url)
              msg.channel.sendMessage(FurryArray.join('\n'))
            }
          })
        }
      })
  }
}

Commands.e621 = {
  name: 'e621',
  usage: '<tags> multiword tags need to be typed like: wildbeast_is_a_discord_bot',
  level: 0,
  nsfw: true,
  fn: function (msg, suffix) {
    msg.channel.sendTyping()
    unirest.post(`https://e621.net/post/index.json?limit=30&tags=${suffix}`)
      .headers({
        'Accept': 'application/json',
        'User-Agent': 'Unirest Node.js'
      })
      // Fetching 30 posts from E621 with the given tags
      .end(function (result) {
        if (result.body.length < 1) {
          msg.reply('Sorry, nothing found.') // Correct me if it's wrong.
  } else {
          var count = Math.floor((Math.random() * result.body.length))
          var FurryArray = []
          if (suffix) {
            FurryArray.push(`${msg.author.mention}` + '`, your results for `' + suffix + '`')
          } else {
            FurryArray.push(`${msg.author.mention}` + ', you didn\'t specified something so this is a random picture')
          } // hehe no privacy if you do the nsfw commands now.
          FurryArray.push(result.body[count].file_url)
          msg.channel.sendMessage(FurryArray.join('\n'))
        }
      })
  }
}

Commands.ball = {
  name: 'ball',
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
	'Signs point to yes',
	'Reply hazy try again',
	'Ask again later',
	'Better not tell you now',
	'Cannot predict now',
	'Concentrate and ask again',
	'Don\'t count on it',
	'My reply is no',
	'My sources say no',
	'Outlook not so good',
	'Very doubtful'
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
    var answers = [
      '1',
	  '2',
	  '3',
	  '4',
	  '5',
	  '6',
	  '7',
	  '8',
	  '9',
	  '10',
	  '11',
	  '12',
	  '13',
	  '14',
	  '15',
	  '16',
	  '17',
	  '18',
	  '19',
	  '20',
	  '21',
	  '22',
	  '23',
	  '24',
	  '25',
	  '26',
	  '27',
	  '28',
	  '29',
	  '30',
	  '31',
	  '32',
	  '33',
	  '34',
	  '35',
	  '36',
	  '37',
	  '38',
	  '39',
	  '40',
	  '41',
	  '42',
	  '43',
	  '44',
	  '45',
	  '46',
	  '47',
	  '48',
	  '49',
	  '50',
	  '51',
	  '52',
	  '53',
	  '54',
	  '55',
	  '56',
	  '57',
	  '58',
	  '59',
	  '60',
	  '61',
	  '62',
	  '63',
	  '64',
	  '65',
	  '66',
	  '67',
	  '68',
	  '69',
	  '70',
	  '71',
	  '72',
	  '73',
	  '74',
	  '75',
	  '76',
	  '77',
	  '78',
	  '79',
	  '80',
	  '81',
	  '82',
	  '83',
	  '84',
	  '85',
	  '86',
	  '87',
	  '88',
	  '89',
	  '90',
	  '91',
	  '92',
	  '93',
	  '94',
	  '95',
	  '96',
	  '97',
	  '98',
	  '99',
	  '100'
    ]
    var answer = answers[Math.floor(Math.random() * answers.length)]
    msg.channel.sendMessage(':game_die ' + msg.author.mention + ' rolled from 1 to 100 and got ' + answer)
  }
}

Commands.rps = {
  name: 'rps',
  module: 'fun',
  usage: '<your choose, if it is rock, paper or scissors>',
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
  } else {
  msg.channel.sendMessage(':ok_hand: ' + suffix + ' received a ' + answer + ' from me')
      }
}
}

Commands.choose = {
  name: 'choose',
  module: 'fun',
  timeout: 3,
  level: 0,
  fn: function (msg, suffix) {
        if (!suffix || suffix.split(",").length < 2) msg.channel.sendMessage(":x: Something went wrong, try again.").catch();
        else {
            let choices = suffix.split(",");
            msg.channel.sendMessage(":thinking: " + msg.author.username + ", if I had to choose the best option, I would pick " + choices[Math.floor(Math.random() * (choices.length))] + ".").catch();
        }
    }
}

//English -FINISH-

exports.Commands = Commands