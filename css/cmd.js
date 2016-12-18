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

    var q_what = 'UB3R-B0T was created by moiph in 2005 using mirc scripts. Then in like college or something my friend Jerry was all like "i have a php irc bot" and i was like "sweet dude" so then we reworked that code to make an irc bot framework (hotnsour) and then UB3R-B0T used that to become UB2R-B0T. Then, in 2012, UB2R-B0T was killed off in favor of version 3, UB3R-B0T, which was rebuilt in C#. Then in 2015 UB3R-B0T continued to be UB3R-B0T but added Discord support.';

   // var q_do = "Many things.  Here's just a boring list of some of the commands with no extra documentation (yet): .8ball, .b, .chuck_norris, .expand, .fw, .stock, .help, .isup, .lastfm, .metal, .note, .poe, .seen, .shorten, .steam, .sw, .title, .twitter, .ud, .ups, .weather, .wolfram";
    var q_do = 'Many things. Reminders, searches, package tracking, weather, RSS/Twitter/Twitch notifications, and so on.';

    consoletype(q_what, document.getElementById('q_what'));
    consoletype(q_do, document.getElementById('q_do'));
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
      } else if (cmdval == "8ball" || cmdval == ".8ball") {
        cmdDetails.innerHTML = ".8ball yes or no question? | Receive an answer";
      } else if (cmdval == "dir") {
        var time = new Date().toLocaleString();
        cmdDetails.innerHTML = "&nbsp;Directory of U:\UB3R-B0T<br/><br/>" + 
            time + " &lt;DIR&gt; .<br/>" + 
            time + " &lt;DIR&gt; ..<br/>" +
            "0 File(s) 0 bytes<br/>" +
            "2 Dir(s)  9,351,5361,351,515 bytes free";
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
