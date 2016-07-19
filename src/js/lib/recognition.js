var Recognizer = (function() {
  var recognition = {};
  if (window.hasOwnProperty('SpeechRecognition')) {
    recognition.speech = SpeechRecognition;
  } else if (window.hasOwnProperty('webkitSpeechRecognition')) {
    recognition.speech = webkitSpeechRecognition;
  }

  return {
    compatible: function() {
      return Boolean(recognition.speech)
    },
    init: function(opts) {
      var opts = opts || {};
      recognition.recognizer = new(recognition.speech)();
      recognition.recognizer.continuous = true;
      recognition.recognizer.interimResults = true;

      recognition.recognizer.onresult = function(event) {
        var interim = '';
        var last = '';
        $('#interim-transcript').text('');
        for (var i = event.resultIndex; i < event.results.length; i++) {
          var result = event.results[i];
          if (result.isFinal) {
            last = result[0].transcript;
          } else {
            interim += result[0].transcript;
          }
        }

        if (last) {
          opts.handleResult(last);
        } else {
          $('#interim-transcript').text(interim);
        }
      }
    },
    startListening: function() {
      recognition.recognizer.onend = function() {
        // Chrome stops listening after about ten seconds of no speech, so we're immediately reinitializing
        // the recognizer when it stops
        recognition.recognizer.start();
      }
      recognition.recognizer.start();
    },
    stopListening: function() {
      // since .abort triggers the onend event, we're removing the event handler before calling it
      recognition.recognizer.onend = undefined;
      recognition.recognizer.abort();
    }
  }
})()
