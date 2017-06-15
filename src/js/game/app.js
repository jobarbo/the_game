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

game.global = {
	score: 0,
	life: 3,
  level: 1,
  ship: 'ship1',
};



// Automatically register each state.
_.each(states, function(state, key) {
  game.state.add(key, state);
});

game.state.start('boot');
