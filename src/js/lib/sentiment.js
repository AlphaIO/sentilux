var Sentiment = (function() {
  var wordList;
  var config = {
    minBufferSize: 1,
    maxBufferSize: 50
  };
  var buffer = [];
  var tokenizeRegex = /[^\wá-úñäâàéèëêïîöôùüûœç-]/g;

  return {
    init: function(opts) {
      $.extend(config, opts || {});
      $.getJSON(config.wordListURL || 'wordlists/afinn.json')
        .done(function(data) {
          wordList = data;
        })
        .fail(function(res, status, err) {
          Util.showError({
            message: 'We had an error fetching the word list for sentiment analysis.'
          });
        });
    },
    classify: function(text) {
      var tokens = text
        .toLowerCase()
        .trim()
        .replace(/\s/g, ' ')
        .replace(/(\s){2,}/g, '$1')
        .split(' ');

      var gathered = tokens.reduce(function(acc, token) {
        var nakedToken = token.replace(tokenizeRegex, '');
        var nakedPrev = acc.prev.replace(tokenizeRegex, '');
        var score = wordList.words[nakedToken];
        if (wordList.stopwords.indexOf(nakedToken) === -1 && typeof score === 'number') {
          var negated = wordList.negators.indexOf(nakedPrev) !== -1;
          if (negated) {
            token = acc.prev + ' ' + token;
            nakedToken = nakedPrev + ' ' + nakedToken;
            score = -score;
          }
          
          score = (score + 5) / 10; // scaling to 0-1 range

          // we're keeping the un-naked (clothed?) token here so we can easily match against the original text
          acc.scores[token] = score;

          acc.sum += score;
          acc.count++;
        }
        return {
          prev: token,
          scores: acc.scores,
          sum: acc.sum,
          count: acc.count
        }
      }, {
        prev: '',
        scores: {},
        sum: 0,
        count: 0
      });

      var result = {
        scores: gathered.scores,
        mean: gathered.count > 0 ? gathered.sum / gathered.count : undefined
      };

      Sentiment.push(result.mean);

      return result
    },
    push: function(value) {
      if (typeof value === 'number') {
        buffer.unshift(value);
        if (buffer.length > config.bufferSize) {
          buffer.pop();
        }

        if (config.onUpdate && buffer.length >= config.minBufferSize) {
          config.onUpdate(sum(buffer) / buffer.length);
        }
      }
    },
    bufferSize: function() {
      // might want to make this getBuffer() to widen the functionality
      return buffer.length
    }
  }

  function sum(values) {
    return values.reduce(function(total, value) {
      return total + value
    }, 0);
  }
})()
