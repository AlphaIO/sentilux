var Util = (function() {
  return {
    showError: function(opts) {
      $('#error-modal h1').text(opts.title || 'Whoops!');
      if (opts.html) {
        $('#error-modal p').html(opts.html);
      } else {
        var message = opts.message || 'An unknown error occured.';
        if (message.slice(message.length) - 1 !== '.') {
          message += '.';
        }
        $('#error-modal p').text(message);
      }
      
      $('#error-modal').foundation('open');
    },
    hideError: function() {
      $('#error-modal').foundation('close');
    }
  }
})()