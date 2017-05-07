var preloader = {};

preloader.preload = function () {
  this.game.load.image('logo', 'images/phaser.png');
  this.game.load.image('button', 'images/button_green.png');
  this.game.load.image('background', 'images/background/bg.png');
  this.game.load.image('player', 'images/player/playerShip2_green.png');
  this.game.load.image('laser', 'images/laserr.png');
};

preloader.create = function () {
  this.game.state.start('game');
};

module.exports = preloader;
