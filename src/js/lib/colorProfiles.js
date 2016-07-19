ColorProfiles = (function() {
  var config = {
    profile: {
      name: 'moodlight'
    }
  }
  var profiles = {
    moodlight: {
      settings: {
        positive: '#00FF00',
        positiveDisplay: '#3ADB76',
        negative: '#FF0000',
        negativeDisplay: '#EC5840'
      },
      colorizer: function(value, settings) {
        return {
          light: mix(settings.negative, settings.positive, value).hexString(),
          display: mix(settings.negativeDisplay, settings.positiveDisplay, value).hexString()
        }
      }
    },
    calming: {
      settings: {
        threshold: 0.4,
        default: '#E5DEC0',
        defaultDisplay: '#DACE9B',
        calming: '#48C5B0',
        calmingDisplay: '#6ACEC1'
      },
      colorizer: function(value, settings) {
        if (value <= settings.threshold) {
          return {light: settings.calming, display: settings.calmingDisplay}
        } else {
          return {light: settings.default, display: settings.default}
        }
      }
    }
  }

  return {
    config: function(opts) {
      $.extend(config, opts || {});
    },
    colorize: function(value) {
      var profile = profiles[config.profile.name];
      return profile.colorizer(value, config.profile.settings || profile.settings);
    }
  }

  function mix(color1, color2, amount) {
    return Color(color2).mix(Color(color1), amount);
  }
})();
