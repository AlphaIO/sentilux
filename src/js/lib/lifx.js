var LIFX = (function() {
  var token = Cookies.get('LIFX_TOKEN');
  var BASEURL = 'https://api.lifx.com/v1';

  var api = {
    init: function(cb) {
      if (!cb) {
        cb = function() {};
      }
      if (token) {
        cb();
      } else {
        $('#auth-modal').foundation('open');
        $('#auth-token-submit').click(function() {
          var inputVal = $('#auth-token-input').val();
          if (inputVal) {
            request('GET', '/lights/all', {
              _token: inputVal
            })
              .then(function(res) {
                token = inputVal;
                Cookies.set('LIFX_TOKEN', token, {
                  path: '',
                  expires: 60
                });
                $('#auth-token-error').hide();
                $('#auth-token-submit').off('click');
                $('#auth-modal').foundation('close');

                cb();
              })
              .then(undefined, function(err) {
                $('#auth-token-error p').text(err.error + '.' || 'An unknown error occured.');
                $('#auth-token-error').show();
              });
          } else {
            $('#auth-token-error p').text('Please enter a token.');
            $('#auth-token-error').show();
          }
        })
      }
    },
    setState: function(selector, params) {
      return request('PUT', '/lights/' + (selector || 'all') + '/state', params || {})
    },
    logout: function() {
      Cookies.remove('LIFX_TOKEN', {
        path: ''
      });
      location.reload();
    }
  };

  return api

  function request(method, endpoint, params) {
    var promise = new Promise(function(resolve, reject) {
      $.ajax({
        method: method || 'GET',
        dataType: 'json',
        url: BASEURL + endpoint,
        data: params || {},
        headers: {
          'Authorization': 'Bearer ' + (params._token || token)
        }
      })
        .done(function(data) {
          resolve(data);
        })
        .fail(function(res, status, err) {
          if (res.responseJSON) {
            reject(res.responseJSON);
          } else {
            reject({
              err: error
            });
          }
        });
    });

    return promise
  }
})()
