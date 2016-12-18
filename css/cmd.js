(function () {
  var x = document.getElementById('x');
  x.addEventListener('click', close, false);
  var max = document.getElementById('max');
  max.addEventListener('click', maximize, false);
  var min = document.getElementById('min');
  min.addEventListener('click', minimize, false);
  var minwin = document.getElementById('minwin');
  minwin.addEventListener('click', restore, false);
  var cmd = document.getElementById('cmd');
  cmd.addEventListener('keyup', cmdKeyup, false);
  var blink = document.getElementById('blink');

  cmd.addEventListener('focus', cmdFocus, false);
  cmd.addEventListener('blur', cmdBlur, false);

  var cmdDetails = document.getElementById('cmdDetails');
  var conWindow = document.getElementById('window');

  var isMax = false;

  function init() {
    cmd.focus();

    var q_hifumi1 = 'Hello, my name is Hifumi and I\'m a multifunctional + music bot that will give you fun and is very easy to use.';
    var q_hifumi2 = 'To get started, select your favorite command category by typing a number and know more.';
    var q_hifumi3 = 'PLEASE NOTE! More features are coming soon, any suggestion is really appreciated :D';
    var q_hifumi4 = 'Do you think you like this bot? Invite it to your server here: <a>https://discordapp.com/oauth2/authorize?client_id=227171028072267778&scope=bot&permissions=2146958463</a>';
    var q_hifumi5 = 'In case of problems, suggestions or want to see bot progress join to our support server: <a>https://discord.gg/FtDbNrd</a>';

    consoletype(q_hifumi1, document.getElementById('q_hifumi1'));
    consoletype(q_hifumi2, document.getElementById('q_hifumi2'));
    consoletype(q_hifumi3, document.getElementById('q_hifumi3'));
    consoletype(q_hifumi4, document.getElementById('q_hifumi4'));
    consoletype(q_hifumi5, document.getElementById('q_hifumi5'));
  }

  function close(ev) {
    conWindow.style.display = 'none';
    document.getElementById('close').style.display = 'block';
    ev.preventDefault();
    return false;
  }

  function maximize(ev) {
    if (!isMax) {
      max.innerHTML = '&#10064;';
      conWindow.parentElement.style.width = '100%';
      conWindow.parentElement.style.maxWidth = '100%';
    } else {
      max.innerHTML = '&#9744;';
      conWindow.parentElement.style.width = '';
      conWindow.parentElement.style.maxWidth = '';
    }

    isMax = !isMax;
    ev.preventDefault();
    return false;
  }

  function minimize(ev) {
    conWindow.style.display = 'none';
    minwin.style.display = 'block';
    ev.preventDefault();
    return false;
  }

  function restore(ev) {
    conWindow.style.display = '';
    minwin.style.display = 'none';
    ev.preventDefault();
    return false;
  }

  function cmdKeyup(ev) {
    if (ev.which == 13) {
      var cmdval = cmd.value;

      if (cmdval == 'cls') {
        document.getElementById('text').innerHTML = '';
      } else if (cmdval == "1" || cmdval == "~help 1") {
        cmdDetails.innerHTML = "Fun/Misc.<br /><br />" +
"~8ball - ask a question to the magic 8 ball.<br />" +
"~chocolate - Gift a chocolate to someone.<br />" +
"~chocolate eat - Eat an already gifted chocolate.<br />" +
"~choose - choose the best option between 2 options or more, separate options with a ','<br />" +
"~coinflip - flip a coin and get a result.<br />" +
"~dice - roll a dice, you can use '1dnumber' as suffix to modify dice sides (replace number with a number)<br />" +
"~garfield - get a Garfield comic from any date of 1978-today.<br />" +
"~gif - search for a GIF on Giphy.<br />" +
"~hifumi - display a random GIF from Hifumi on NEW GAME! anime.<br />" +
"~leetspeak - c0nv3r7 `/0ur 73x7 1ik3 7hi5.<br />" +
"~rate - rate a user or character.<br />" +
"~rip - create a ripme.xyz link with the user you mention.<br />" +
"~roll - get a random number from 1 to 100.<br />" +
"~rps - play rock, paper and scissors with Hifumi.<br />" +
"~slap - slap someone.<br />" +
"~say - make the bot repeat something, mentions and invites are not allowed.<br />" +
"~talk - talk with Hifumi and have a conversation (powered by Cleverbot)<br />" +
"~triggered - react with a Triggered meme.";
      } else if (cmdval == "2" || cmdval == "~help 2") {
        cmdDetails.innerHTML = "Utilities<br /><br />" +
"~advice - get a random advice for something random.<br />" +
"~fact - get a fact for something interesting.<br />" +
"~catfacts - get a curious cat fact.<br />" +
"~google - let Hifumi google that for you!<br />" +
"~nicknames - use this with a user to know his/her previous nicknames.<br />" +
"~server-info - get some information about the server you are in.<br />" +
"~twitch - search for a Twitch channel and know if he/she is streaming or not.<br />" +
"~userinfo - get some information about a server member.<br />" +
"~urban - search for a word on Urban Dictionary database.<br />" +
"~weather - search the weather for a city.<br />" +
"~yesno - get a random GIF saying if 'yes' or 'no' to your question.";
      } else if (cmdval == "3" || cmdval == "~help 3") { 
       cmdDetails.innerHTML = "Moderation<br /><br />" +
"~ban - apply the ban hammer to someone.<br />" +
"~clean - clean from 1 to 100 messages.<br />" +
"~customize - main command to modify bot replies, welcome system and prefix. Use ~customize help on Discord chat to know more.<br />" +
"~kick - kick someone, keep in mind that he/she can re-join.<br />" +
"~setlevel - use it with a number and a user to level up her/him!<br />" +
"~setnsfw - toggle the NSFW commands on the channel.";
      } else if (cmdval == "4" || cmdval == "~help 4") { 
       cmdDetails.innerHTML = "Music<br /><br />" +
"~music - Hifumi will play music in the voice channel. You can specify one or not.<br />" +
"~request - Hifumi will play a song for you, use a link from YouTube, Soundcloud or a mp3 uploaded file<br />" +
"~listenmoe - Hifumi will play listen.moe radio station.<br />" +
"~radio - Hifumi will play a radio stream file for you. Use ~radio help in Discord chat to know how to get stream link of your favorite station.<br />" +
"~youtube - search something in YouTube.<br />" +
"~song pause - The current song will be paused if it's playing.<br />" +
"~song play - The current song will be resumed if it's paused.<br />" +
"~volume - Change the volume of the current song.<br />" +
"~playlist - List upcoming requested songs. Hifumi will show this in order.<br />" +
"~shuffle - Shuffle the music playlist and songs will be played in random order.<br />" +
"~skip - Vote to skip the current song if you don't like it.<br />" +
"~forceskip - Force skip the current song.<br />" +
"~shutdown - Hifumi will no longer play music in the voice channel.";      
      } else if (cmdval == "5" || cmdval == "~help 5") { 
       cmdDetails.innerHTML = "Tags<br /><br />" +
"~tag create - create a new tag (order: command tag content)<br />" +
"~tag delete - delete an existing tag (order: command tag)<br />" +
"~tag edit - edit an existing tag (order: command tag new content)<br />" +
"~tag owner - display the owner for an existing tag (order: command tag)";
      } else if (cmdval == "6" || cmdval == "~help 6") { 
       cmdDetails.innerHTML = "NSFW<br /><br />" +
"~e621 - search for furry porn on e621.<br />" +
"~rule34 - if it exists, there's porn of it.<br />" +
"~konachan - search for hentai on Konachan.<br />" +
"~greenteaneko - show a random bizarre GreenTeaNeko comic.";
      } else if (cmdval == "7" || cmdval == "~help 7") { 
       cmdDetails.innerHTML = "Bot information<br /><br />" +
"~about - display the bot information, including useful links.<br />" +
"~stats - display the bot stadistics.<br />" +
"~help - display the command help menu.<br />" +
"~ping - respond with pong plus response delay on ms, useful to test the bot functioning.<br />" +
"~invite - display the bot OAuth invite link.<br />" +
"~leave - I'll leave the server.";
      } else if (cmdval == "help" || cmdval == "~help") {
        cmdDetails.innerText = cmdDetails.textContent = "I already sent my command help and also this is the command page! Baka! >.<";
      } else {
         cmdDetails.innerText = cmdDetails.textContent = "'" + cmdval + "' is not recognized as an internal or external command, operable program or batch file.";
      }

      cmd.value = '';
    }

    if (cmd.value == '') {
      blink.style.display = '';
    } else {
      blink.style.display = 'none';
    }

    return true;
  }

  function cmdFocus(ev) {
    blink.style.display = 'inline';
  }

  function cmdBlur(ev) {
    blink.style.display = 'none';
  }

  function consoletype(text, el) {
    var len = text.length;
    for (var i = 0; i < len; i++) {
      writeText(text[i], el, i*5);
    }
  }

  function writeText(char, el, delay) {
    setTimeout(function () {
      el.innerHTML = el.innerHTML + char;
    }, delay);
  }

  init();
})();
