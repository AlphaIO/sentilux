# SentiLux [![Build Status](https://travis-ci.org/YottaInc/sentilux.svg?branch=master)](https://travis-ci.org/YottaInc/sentilux)
### [Try it now!](https://yottainc.github.io/sentilux/)

SentiLux is a static web application that adjusts your [LIFX](http://www.lifx.com/) connected lightbulbs to reflect the emotional sentiment of the room, measured through speech.

## Why?

SentiLux was produced as part of GE's [Lights for Life](https://www.hackster.io/challenges/LightsforLife) challenge as an experiment exploring how lighting can be used to reflect or even positively influence emotion by analyzing speech. If you're talking with your friend about how bad your day has been, SentiLux can change your lights to a calming color.

## How?

It uses the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) to listen to and transcribe speech in your room, then uses the [AFINN](http://www2.imm.dtu.dk/pubdb/views/publication_details.php?id=6010) list of sentiment-weighted words to score speech based on relative emotional negativity or positivity.

After each chunk of speech is recognized and scored, the score is pushed into a buffer. The mean of the buffer is calculated and used to evaluate a "profile" function that determines how to change the lighting. There are two profiles currently available, and more can be added easily:

**Moodlight**: Adjusts color between red and green based on score.  
**Calming light**: Changes from white to a calming light blue when the average score drops below 0.4.

Finally, the color calculated by the profile function is sent to the LIFX [HTTP API](https://api.developer.lifx.com/), and your lights crossfade to the new color!

## TODO

- [ ] Add more customizable settings
  - [ ] Add setting for a LIFX API [selector](https://api.developer.lifx.com/docs/selectors) to allow the user to choose which lights to control
  - [ ] Add ability to customize profiles, choosing the colors each profile uses
- [ ] Investigate alternative wordlists/sentiment analysis algorithms
- [ ] Add more profiles!
