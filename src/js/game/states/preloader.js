var preloader = {};

preloader.preload = function () {
  this.game.load.image('logo', 'images/phaser.png');
  this.game.load.image('button', 'images/button_green.png');
  this.game.load.image('background', 'images/background/bg.png');
  this.game.load.image('player', 'images/player/playerShip2_green.png');
  this.game.load.image('life', 'images/player/life_green.png');
  this.game.load.image('laser', 'images/laserr.png');
  this.game.load.image('coin', 'images/collectables/coin/gold_1.png');
  this.game.load.image('star', 'images/collectables/star_silver.png');
  this.game.load.image('enemy', 'images/ennemies/enemyRed2.png');
  this.game.load.image('pixel', 'images/pixel.png');
  this.game.load.image('shield', 'images/shield.png');
  this.game.load.image('multiammo', 'images/collectables/star_gold.png');

  this.game.load.audio('coin', 'audio/powerup.mp3');
  this.game.load.audio('laser', 'audio/laser.mp3');
};

preloader.create = function () {
  this.game.state.start('mainTitle');
};

module.exports = preloader;
