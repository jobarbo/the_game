var _ = require('lodash');
var properties = require('./properties');

var states = {
  boot: require('./states/boot.js'),
  preloader: require('./states/preloader.js'),
  mainTitle: require('./states/mainTitle.js'),
  game: require('./states/game.js'),
  level2: require('./states/level2.js'),
  level3: require('./states/level3.js'),
  finish: require('./states/finish.js'),
  choose: require('./states/choose.js'),
  tuto: require('./states/tuto.js')
};

var game = new Phaser.Game(properties.size.x, properties.size.y, Phaser.AUTO, '', null, false, false);

WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function() { 
      alert("active mofocka");
      this.game.time.events.add(Phaser.Timer.SECOND, this.createText, this); 
    },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Inconsolata']
    }

};

game.global = {
	score: 0,
	life: 3,
  level: 1,
  ship: 'ship1',
  currentWeapon: 'laser_green',
  currentPage: 1,
};



// Automatically register each state.
_.each(states, function(state, key) {
  game.state.add(key, state);
});

game.state.start('boot');
