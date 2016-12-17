var Commands = []
var Database = require('nedb')
var Config = require('../../../config.json')
var db = new Database({
  filename: './runtime/databases/chocolates',
  autoload: true
})

Commands.chocolate = {
  name: 'chocolate',
  noDM: true,
  level: 0,
  timeout: 5,
  fn: function (msg, suffix, bot) {
	  var index = suffix.split(' ')
	  if (!suffix) {
  msg.channel.sendMessage(':chocolate_bar: Please specify if you want to gift a chocolate bar to someone or eat an already gifted chocolate bar.')
  } else if (msg.mentions.length === 1 && msg.mentions[0].id === bot.User.id) {
  msg.channel.sendMessage(':chocolate_bar: Thank you so much! >w<')
  } else if (msg.mentions.length === 1 && msg.mentions[0].id === msg.author.id) {
  msg.channel.sendMessage(':chocolate_bar: ' + msg.author.mention + ' gifted a chocolate to... Alone? https://49.media.tumblr.com/ed2e8edab9cefbffcffa150d140efed6/tumblr_o2pv6x7Pki1u8i4oto1_500.gif')
  } else if (suffix === '@everyone' || suffix === '@here') {
	  msg.channel.sendMessage('What?') 
  } else if (msg.mentions.length === 1) {
        db.find({
		  gift: msg.author.id,
          _id: suffix.replace("<@!","<@")
        }, function (err, res) {
          if (err) {
            msg.channel.sendMessage('This user already haves a chocolate bar. Wait until he/she decide to eat it and try again.')
          } else if (res) {
			return
            }
        })
        db.insert({
		  gift: msg.author.id,
          _id: suffix.replace("<@!","<@")
        }, function (err, res) {
          if (err) {
            msg.channel.sendMessage('This user already haves a chocolate bar. Wait until he/she decide to eat it and try again.')
          } else if (res) {
			msg.channel.sendMessage(':chocolate_bar: ' + msg.author.mention + ' gifted a chocolate to ' + suffix + '! ' + suffix + ', to eat this chocolate type ``' + config.settings.prefix + 'chocolate eat ' + msg.author.id + '``')
		 }
		})
  } else if (index[0].toLowerCase() === 'eat') {
	    db.find({
		  gift: index[1].toLowerCase(),
          _id: '<@' + msg.author.id + '>'
        }, function (err, res) {
          if (err) {
            msg.channel.sendMessage('Something went wrong or the specified chocolate bar to eat is invalid.')
          } 
		 if (res.length < 0) {
		 msg.channel.sendMessage(':chocolate_bar: You don\'t have chocolates to eat https://media.tenor.co/images/06ae6bbe852471939cf61a81e5a9eb23/raw')
            } else {
              db.remove({
		  gift: index[1].toLowerCase(),
          _id: '<@' + msg.author.id + '>'
              }, function (err, res) {
                if (err) {
                  msg.channel.sendMessage('Something went wrong or the specified chocolate bar to eat is invalid.')
                } else if (res) {
              msg.channel.sendMessage(':chocolate_bar: ' + msg.author.mention + ' just ate a chocolate and say "Thank you" to the person who gifted it. http://funnypictures3.fjcdn.com/reaction_gifs/5805842+_5273421300c30324b53257147096ec58.gif')
                }
              })
            }
        })
  } else if (index[0].toLowerCase() === 'eat' && !index[1].toLowerCase()) {
	msg.channel.sendMessage(':chocolate_bar: Please mention the chocolate bar you want to eat.')
  } else if (msg.mentions.length >=1) {
	msg.channel.sendMessage(':chocolate_bar: You can gift chocolates to 1 user only.')  
  } else if (msg.mentions.length === 0 || suffix && msg.mentions.length === 0) {
	msg.channel.sendMessage(':chocolate_bar: Please use mentions to gift chocolates!') 
  } else {
	msg.channel.sendMessage('Something went wrong.')
  }
}
}

exports.Commands = Commands