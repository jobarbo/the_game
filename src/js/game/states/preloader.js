var preloader = {};

preloader.preload = function () {
  this.game.load.image('logo', 'images/phaser.png');
  this.game.load.image('button', 'images/button_green.png');
  this.game.load.image('background', 'images/background/bg.png');
  this.game.load.image('player', 'images/player/playerShip2_green.png');
  this.game.load.image('laser', 'images/laserr.png');
  this.game.load.image('coin', 'images/collectables/coin/gold_1.png');

  this.game.load.audio('coin', 'audio/powerup.mp3');
};

preloader.create = function () {
  this.game.state.start('level1');
};

module.exports = preloader;
