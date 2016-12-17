var Commands = []
var request = require('request')
var config = require('../../../config.json')
var Logger = require('../../internal/logger.js').Logger
var argv = require('minimist')(process.argv.slice(2))
let axios = require('axios'),
    moment = require('moment'),
    compass = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"],
    xml2js = require('xml2js')
	fix = require('entities')

Commands.weather = {
  name: 'weather',
  timeout: 5,
  level: 0,
  fn: function (msg, suffix) {
        if (!suffix) suffix = "Toronto";
        suffix = suffix.replace(" ", "+");
        let URL = (/\d/.test(suffix) == true) ? "http://api.openweathermap.org/data/2.5/weather?q=" + suffix + "&APPID=dd90e6af283b3d6f6a0462df94ecb1b0" : "http://api.openweathermap.org/data/2.5/weather?zip=" + suffix + "&APPID=dd90e6af283b3d6f6a0462df94ecb1b0";
        axios.get(URL).then(response => {
            if (response.status == 200 && response.data.cod !== '404') {
                let weath = response.data,
                    weatherC = ":sunny:";
                if (!weath.hasOwnProperty("weather")) return;
                if ((weath.weather[0].description.indexOf("rain") > -1) || (weath.weather[0].description.indexOf("drizzle") > -1)) weatherC = ":umbrella:";
                else if (weath.weather[0].description.indexOf("snow") > -1) weatherC = ":snowflake:";
                else if (weath.weather[0].description.indexOf("clouds") > -1) weatherC = ":cloud:";
                else if (weath.weather[0].description.indexOf("storm") > -1) weatherC = ":cloud_lightning:";
                msg.channel.sendMessage(`:earth_americas: __**Weather for ${weath.name === '' ? '' : weath.name+', '}${weath.sys.country}:**__ • (*${weath.coord.lat}, ${weath.coord.lon}*)
**${weatherC} Conditions:** ${weath.weather[0].description}
**:sweat_drops: Humidity:** ${weath.main.humidity}% **|** **:thermometer: Current Temperature:** ${Math.round(weath.main.temp - 273.15)}°C / ${Math.round(((weath.main.temp - 273.15) * 1.8) + 32)}°F
**:cloud: Cloudiness:** ${weath.clouds.all}% **|** **:dash: Wind Speed:** ${weath.wind.speed} m/s [*${compass[((Math.floor((weath.wind.deg / 22.5) + 0.5)) % 16)]}*]
**:sunrise_over_mountains: Sunrise:** ${moment(weath.sys.sunrise * 1000).format('HH:mm')} UTC **|** **:city_sunset: Sunset:** ${moment(weath.sys.sunset * 1000).format('HH:mm')} UTC`);
            } else msg.channel.sendMessage(':warning: There was an error getting the weather');
        })
    }
}

Commands.google = {
  name: 'google',
  timeout: 5,
  level: 0,
  fn: function (msg, suffix) {
              msg.channel.sendMessage("Done! http://www.lmgtfy.com/?q=" + suffix.replace(" ", "+"))
            }
          }

Commands.twitch = {
  name: 'twitch',
  timeout: 10,
  level: 0,
  fn: function (msg, suffix) {
    if (!suffix) {
      msg.channel.sendMessage('Please specify a channel first!')
      return
    }
    var url = 'https://api.twitch.tv/kraken/streams/' + suffix
    request({
      url: url,
      headers: {
        'Accept': 'application/vnd.twitchtv.v3+json',
        'Client-ID': 'ew674jfwrxhbqlrlmvcym63tdeocb4w'
      }
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var resp
        try {
          resp = JSON.parse(body)
        } catch (e) {
          msg.channel.sendMessage('Something went wrong.')
        }
        if (resp.stream !== null) {
          msg.channel.sendMessage('You searched for ' + suffix + ' - Status: **NOW LIVE:** https://www.twitch.tv/' + suffix)
          return
        } else if (resp.stream === null) {
          msg.channel.sendMessage('You searched for ' + suffix + ' - Status: Offline')
          return
        }
      } else if (!error && response.statusCode === 404) {
        msg.channel.sendMessage('You searched for ' + suffix + ' - I couldn\'t find that channel.')
        return
      }
    })
  }
}

Commands['server-info'] = {
  name: 'server-info',
  noDM: true,
  timeout: 20,
  level: 0,
  fn: function (msg) {
    if (msg.guild) {
      var roles = msg.guild.roles.map((r) => r.name)
      roles = roles.splice(0, roles.length).join(', ').toString()
      roles = roles.replace('@everyone', '@every' + '\u200b' + 'one')
      var msgArray = []
      msgArray.push('Information requested by ' + msg.author.mention)
      msgArray.push('Name: **' + msg.guild.name + '** (id: `' + msg.guild.id + '`)')
      msgArray.push('Acronym: **' + msg.guild.acronym + '**')
      msgArray.push('Owner: **' + msg.guild.owner.username + '#' + msg.guild.owner.discriminator + '** (id: `' + msg.guild.owner_id + '`)')
      msgArray.push('Region: **' + msg.guild.region + '**.')
      msgArray.push('**' + msg.guild.members.length + '** members')
      msgArray.push('**' + msg.guild.textChannels.length + '** text channels.')
      msgArray.push('**' + msg.guild.voiceChannels.length + '** voice channels.')
      msgArray.push('**' + msg.guild.roles.length + '** roles registered.')
      msgArray.push("Roles: **" + roles + '**')
      if (msg.guild.afk_channel === null) {
        msgArray.push('No voice AFK-channel present.')
      } else {
        msgArray.push('Voice AFK-channel: **' + msg.guild.afk_channel.name + '** (id: `' + msg.guild.afk_channel.id + '`)')
      }
      if (msg.guild.icon === null) {
        msgArray.push('No server icon present.')
      } else {
        msgArray.push('Server icon: ' + msg.guild.iconURL)
      }
      msg.channel.sendMessage(msgArray.join('\n'))
    } else {
      msg.channel.sendMessage("You can't use this in DM! Baka~")
    }
  }
}


Commands.setstatus = {
  name: 'setstatus',
  module: 'default',
  level: 'master',
  fn: function (msg, suffix, bot) {
    var first = suffix.split(' ')
    if (/^http/.test(first[0])) {
      bot.User.setStatus(null, {
        type: 1,
        name: suffix.substring(first[0].length + 1),
        url: first[0]
      })
      msg.channel.sendMessage(`Set status to streaming with message: "${suffix.substring(first[0].length + 1)}"`)
    } else if (['online', 'idle'].indexOf(first[0]) > -1) {
        bot.User.setStatus(first[0], {
          name: suffix.substring(first[0].length + 1)
        })
        msg.channel.sendMessage(`Set status to ${first[0]} with message: "${suffix.substring(first[0].length + 1)}"`)
	} else if (['dnd'].indexOf(first[0]) > -1) {
        bot.User.setStatus(first[0], {
          name: suffix.substring(first[0].length + 1)
        })
        msg.channel.sendMessage(`Set status to ${first[0]} with message: "${suffix.substring(first[0].length + 1)}"`)
      } else {
        msg.reply(':no_entry_sign: Incorrect usage!')
      }
    }
  }

Commands.userinfo = {
  name: 'userinfo',
  noDM: true,
  level: 0,
  fn: function (msg) {
    var Permissions = require('../../databases/controllers/permissions.js')
    if (msg.isPrivate) {
      msg.channel.sendMessage("Sorry, you can't use this in DMs")
    }
    if (msg.mentions.length === 0) {
      Permissions.checkLevel(msg, msg.author.id, msg.member.roles).then((level) => {
        var msgArray = []
        var roles = msg.member.roles.map((r) => r.name)
        roles = roles.splice(0, roles.length).join(', ')
        msgArray.push('User: ' + msg.author.username + '#' + msg.author.discriminator)
        msgArray.push('ID: ' + msg.author.id)
        msgArray.push('Status: ' + msg.author.status)
        msgArray.push('Signed up in: ' + msg.author.createdAt)
        if (msg.author.gameName) {
          msgArray.push('Playing: ' + msg.author.gameName)
        }
        msgArray.push('Roles: ' + roles)
        msgArray.push('Access level: ' + level)
        if (msg.author.avatarURL) {
          msgArray.push('Avatar: ' + msg.author.avatarURL)
        }
        msg.channel.sendMessage(msgArray.join('\n'))
      }).catch((error) => {
        msg.channel.sendMessage('Something went wrong, try again later.')
        Logger.error(error)
      })
      return
    }
    msg.mentions.map(function (user) {
      Permissions.checkLevel(msg, user.id, user.memberOf(msg.guild).roles).then(function (level) {
        var msgArray = []
        var guild = msg.guild
        var member = guild.members.find((m) => m.id === user.id)
        var roles = member.roles.map((r) => r.name)
        roles = roles.splice(0, roles.length).join(', ')
        msgArray.push('Information requested by ' + msg.author.username)
        msgArray.push('Requested user: ' + user.username + '#' + user.discriminator)
        msgArray.push('ID: ' + user.id)
        msgArray.push('Status: ' + user.status)
        msgArray.push('Signed up in: ' + user.registeredAt)
        if (user.gameName) {
          msgArray.push('Playing: ' + user.gameName)
        }
        msgArray.push('Roles: ' + roles)
        msgArray.push('Current access level: ' + level)
        if (user.avatarURL) {
          msgArray.push('Avatar: ' + user.avatarURL)
        }
        msg.channel.sendMessage(msgArray.join('\n'))
      }).catch(function (err) {
        Logger.error(err)
        msg.channel.sendMessage('Something went wrong, try again later.')
      })
    })
  }
}

Commands.hat = {
  name: 'hat',
  noDM: true,
  level: 0,
  timeout: 5,
  fn: function (msg, suffix, bot) {
	  if (msg.isPrivate) {
      msg.channel.sendMessage("Sorry, christmas hat avatar function is not available for DMs.")
      }
	  if (msg.mentions.length === 0) {
		  msg.channel.sendMessage('*Your christmas hat avatar is ready and it\'s now uploaded! Merry christmas!*\nURL: <https://hats.discord.pw/?h=december.png&a=avatars/' + msg.author.id + '/' + msg.author.avatar + '>\n\nTo download your avatar, go to the above link and click at the "Download my new avatar!" button on the page bottom.\nIf you find that your hat is wrongly placed, you can place it yourself there.\nCommand powered by abal\'s HatBot API.')
  } else if (msg.mentions.length === 1 && msg.mentions[0].id === bot.User.id) {
  msg.channel.sendMessage('I already have a christmas hat! ¯\\_(ツ)_/¯')
  } else if (suffix === '@everyone' || suffix === '@here') {
	  msg.channel.sendMessage(':no_entry_sign: What? I can\'t give christmas avatars for everyone.') 
  } else if (!msg.author.avatarURL) {
	msg.channel.sendMessage(':no_entry_sign: You\'re not using an avatar!')  
  } else {
       msg.mentions.map(function (user) {
		var guild = msg.guild
        var member = guild.members.find((m) => m.id === user.id)
        if (user.avatarURL) {
		 msg.channel.sendMessage('*Your christmas hat avatar is ready and it\'s now uploaded!*\nURL: <https://hats.discord.pw/?h=december.png&a=avatars/' + user.id + '/' + user.avatar + '>\n\nTo download your avatar, go to the above link and click at the "Download my new avatar!" button on the page bottom.\nIf you find that your hat is wrongly placed, you can place it yourself there.\nCommand powered by abal\'s HatBot API.')
        } else if (!user.avatarURL) {
		 msg.channel.sendMessage(':no_entry_sign: Sorry, the user you mentioned doesn\'t have an avatar or it\'s using a guest account.')
		} else {
		 msg.channel.sendMessage(':no_entry_sign: Something went wrong, try again later.')
		}
})
}
}
}

//Spanish

exports.Commands = Commands