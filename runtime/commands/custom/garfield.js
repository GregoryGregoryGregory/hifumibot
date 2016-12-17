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

Commands.garfield = {
  name: 'garfield',
  module: 'fun',
  timeout: 10,
  level: 0,
fn: function (msg, suffix) {     
		      var answers = [
'1978',
'1979',
'1980',
'1981',
'1982',
'1983',
'1984',
'1985',
'1986',
'1987',
'1988',
'1989',
'1990',
'1991',
'1992',
'1993',
'1994',
'1995',
'1996',
'1997',
'1998',
'1999',
'2000',
'2001',
'2002',
'2003',
'2004',
'2005',
'2006',
'2007',
'2008',
'2009',
'2010',
'2011',
'2012',
'2013',
'2014',
'2015',
'2016'
    ]
    var answer = answers[Math.floor(Math.random() * answers.length)]
   var answers2 = [
'01',
'02',
'03',
'04',
'05',
'06',
'07',
'08',
'09',
'10',
'11',
'12'
    ]
    var answer2 = answers2[Math.floor(Math.random() * answers2.length)]
	   var answers3 = [
'01',
'02',
'03',
'04',
'05',
'06',
'07',
'08',
'09',
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
'30'
    ]
    var answer3 = answers3[Math.floor(Math.random() * answers3.length)]
		   var answers4 = [
'01',
'02',
'03',
'04',
'05',
'06',
'07',
'08',
'09',
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
'31'
    ]
    var answer4 = answers4[Math.floor(Math.random() * answers4.length)]
		   var answers5 = [
'01',
'02',
'03',
'04',
'05',
'06',
'07',
'08',
'09',
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
'28'
    ]
    var answer5 = answers5[Math.floor(Math.random() * answers5.length)]
			   var answers6 = [
'01',
'02',
'03',
'04',
'05',
'06',
'07',
'08',
'09',
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
'29'
    ]
    var answer6 = answers6[Math.floor(Math.random() * answers6.length)]
				   var answers7 = [
'06',
'07',
'08',
'09',
'10',
'11',
'12'
    ]
    var answer7 = answers7[Math.floor(Math.random() * answers7.length)]
if (answer2 === '04' || answer2 === '06' || answer2 === '09' || answer2 === '11') {
  msg.reply('https://d1ejxu6vysztl5.cloudfront.net/comics/garfield/' + answer + '/' + answer + '-' + answer2 + '-' + answer3 + '.gif')  
} else if (answer2 === '01' || answer2 === '03' || answer2 === '05' || answer2 === '07' || answer2 === '08' || answer2 === '10' || answer2 === '12') {
  msg.reply('https://d1ejxu6vysztl5.cloudfront.net/comics/garfield/' + answer + '/' + answer + '-' + answer2 + '-' + answer4 + '.gif')  
} else if (answer2 === '02') {
  msg.reply('https://d1ejxu6vysztl5.cloudfront.net/comics/garfield/' + answer + '/' + answer + '-' + answer2 + '-' + answer5 + '.gif')  
} else if (answer2 === '02' && answer === '1980' || answer2 === '02' && answer === '1984' || answer2 === '02' && answer === '1988' || answer2 === '02' && answer === '1992' || answer2 === '02' && answer === '1996' || answer2 === '02' && answer === '2000' || answer2 === '02' && answer === '2004' || answer2 === '02' && answer === '2008' || answer2 === '02' && answer === '2012' || answer2 === '02' && answer === '2016') {
  msg.reply('https://d1ejxu6vysztl5.cloudfront.net/comics/garfield/' + answer + '/' + answer + '-' + answer2 + '-' + answer6 + '.gif')  
} else if (answer === '1978' && answer2 === '06') {
  msg.reply('https://d1ejxu6vysztl5.cloudfront.net/comics/garfield/' + answer + '/' + answer + '-' + answer7 + '-' + answer3 + '.gif')		
} else {
msg.reply(':no_entry_sign: Error while getting Garfield comic. Try again later!')
}
}
}

exports.Commands = Commands