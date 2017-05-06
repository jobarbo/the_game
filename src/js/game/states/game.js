var game = {};

game.create = function () {
  game.physics.startSystem(Phaser.Physics.P2JS);
  var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
  logo.anchor.setTo(0.5, 0.5);
};

module.exports = game;
