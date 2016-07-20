Sentiment.init({
  maxBufferSize: 50,
  onUpdate: function(mean) {
    var color = ColorProfiles.colorize(mean);

    $('#overall-sentiment')
      .css('background-color', color.display)
      .text((mean * 10).toString().slice(0, 4));
    $('#buffer-size').text(Sentiment.bufferSize().toString());
    $('#stats-list').show();
    
    if (LIFX.live()) {
      LIFX.setState('all', {
        power: 'on',
        color: color.light,
        duration: 10
      })
        .then(function(res) {
          console.log(res);
        })
        .then(undefined, function(err) {
          console.error(err);
          Util.showError({
            message: err.error || 'An unknown error occurred requesting the LIFX API.'
          });
        });
    }
  }
});

LIFX.init(function() {
  $('#logout').click(LIFX.logout);

  if (!Recognizer.compatible()) {
    Util.showError({
      html: 'Your browser doesn\'t seem to support the Speech Recognition API. Try installing the latest version of <a href="https://www.google.com/chrome">Chrome</a>.'
    })
  } else {
    Recognizer.init({
      handleResult: function(result) {
        var sentiment = Sentiment.classify(result);
        $('#interim-transcript').text('');

        $('#last-transcript').text(result);
        $('#last-transcript').html(replaceTokens($('#last-transcript').text()));

        if (typeof sentiment.mean === 'number') {
          $('#last-score span')
            .css('background-color', ColorProfiles.colorize(sentiment.mean).display)
            .animate({
              'width': (sentiment.mean * 100) + '%'
            });
          $('#last-score span p').text((sentiment.mean * 10).toString().slice(0, 4));
          $('#last-score-container').show();
        } else {
          $('#last-score-container').hide();
        }

        $('#last-result').show();

        function replaceTokens(transcript) {
          var scoredTokens = Object.keys(sentiment.scores);
          var regex = new RegExp('(' + scoredTokens.join('|') + ')', 'gi');
          var scored = transcript.replace(regex, function(token) {
            if (typeof sentiment.scores[token] === 'number') {
              var score = sentiment.scores[token];

              var elem = $('<b>')
                .text(token)
                .prop('title', score.toString())
                .addClass('scored-token')
                .css('background-color', ColorProfiles.colorize(score).display);
              return elem[0].outerHTML
            } else {
              return token
            }
          })
          return scored
        }
      }
    });

    $('#toggle-listening')
      .click(function() {
        if ($(this).text() === 'Start Listening') {
          Recognizer.startListening();
          $(this)
            .text('Stop Listening')
            .removeClass('success')
            .addClass('alert');
        } else if ($(this).text() === 'Stop Listening') {
          Recognizer.stopListening();
          $(this)
            .text('Start Listening')
            .removeClass('alert')
            .addClass('success');
        }
      })
      .removeClass('disabled');

    $('#profile-select').change(function() {
      ColorProfiles.config({
        profile: {
          name: this.value
        }
      })
    });
    
    if (!LIFX.live()) {
      // if we're not running with live lights the user is probably just testing out the app, so we display an instructional message
      $('#tip-callout').show();
    }
  }
});
