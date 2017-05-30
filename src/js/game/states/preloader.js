var preloader = {};

preloader.preload = function () {
  this.game.load.image('logo', 'images/phaser.png');
  this.game.load.image('button', 'images/button_green.png');
  this.game.load.image('background', 'images/background/bg.png');
  this.game.load.image('ship1', 'images/player/ship1.png');
  this.game.load.image('ship2', 'images/player/ship2.png');
  this.game.load.image('ship3', 'images/player/ship3.png');
  this.game.load.image('friend', 'images/player/friend1.png');
  this.game.load.image('life', 'images/player/life_green.png');
  this.game.load.image('laser', 'images/laserr.png');
  this.game.load.image('laser_green', 'images/laserg.png');
  this.game.load.image('coin', 'images/collectables/coin/gold_1.png');
  this.game.load.image('shield_bonus', 'images/collectables/shield.png');
  this.game.load.image('pill', 'images/collectables/pill.png');
  this.game.load.image('missile', 'images/collectables/missile.png');
  this.game.load.image('friend_bonus', 'images/collectables/friend.png');
  this.game.load.image('enemy', 'images/ennemies/enemyRed2.png');
  this.game.load.image('second_enemy', 'images/ennemies/spaceShips_004.png');
  this.game.load.image('boss', 'images/ennemies/enemyBlack1.png');
  this.game.load.image('pixel', 'images/pixel.png');
  this.game.load.image('pixel_brown', 'images/pixel_brown.png');
  this.game.load.image('pixel_grey', 'images/pixel_grey.png');
  this.game.load.image('shield', 'images/shield.png');
  this.game.load.image('multiammo', 'images/collectables/multiammo.png');
  this.game.load.image('meteor', 'images/meteor/meteor_brown_big.png');
  this.game.load.image('meteor_med', 'images/meteor/meteor_brown_med.png');
  this.game.load.image('meteor_grey', 'images/meteor/meteor_grey_big.png');
  this.game.load.image('meteor_grey_med', 'images/meteor/meteor_grey_big.png');
  this.game.load.spritesheet('mute', 'images/muteButton.png', 28, 22);

  this.game.load.spritesheet('explosion', 'images/explode.png', 128, 128);

  this.game.load.audio('coin', 'audio/powerup.mp3');
  this.game.load.audio('laser', 'audio/laser.mp3');
  this.game.load.audio('intro', 'audio/intro.ogg');
  this.game.load.audio('boss', 'audio/boss.ogg');
  this.game.load.audio('level1', 'audio/level2.ogg');
  this.game.load.audio('level2', 'audio/level4.ogg');
  this.game.load.audio('pimp', 'audio/get_low.mp3');
};

preloader.create = function () {
  this.game.state.start('mainTitle');
};

module.exports = preloader;
