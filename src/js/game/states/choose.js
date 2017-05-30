var choose = {};

choose.create = function () {

  var background = this.game.add.sprite(this.game.world.centerX - 10, this.game.world.centerY, 'background');
  background.anchor.setTo(0.5, 0.5);
  background.scale.setTo(3.4, 3.4);

  this.pimpMusic = this.game.add.audio('pimp');
  this.pimpMusic.volume = 0.7;
  this.pimpMusic.play();

  this.backLabel = this.game.add.text(150, this.game.world.height - 80, '< Back',
    { font: '20px Arial', fill: '#ffffff' });
  this.backLabel.inputEnabled = true;
  this.backLabel.events.onInputDown.add(this.goBack, this);

  this.chooseShipLabel = this.game.add.text(this.game.world.centerX, 200, 'Choose Ship',
    { font: '60px Arial', fill: '#ffffff' });
  this.chooseShipLabel.anchor.setTo(0.5, 0.5);


  // Add player
  this.player = this.game.add.sprite(this.game.world.centerX - 200, this.game.world.centerY + 50, 'ship1');
  this.player.anchor.setTo(0.5, 0.5);
  this.player.scale.setTo(1.8, 1.8);
  this.player.inputEnabled = true;
  this.player.events.onInputDown.add(this.selectShip, this);
  this.player.events.onInputOver.add(this.changeTint, this);
  this.player.events.onInputOut.add(this.removeTint, this);

  this.player2 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 50, 'ship2');
  this.player2.anchor.setTo(0.5, 0.5);
  this.player2.scale.setTo(1.8, 1.8);
  this.player2.inputEnabled = true;
  this.player2.events.onInputDown.add(this.selectShip, this);
  this.player2.events.onInputOver.add(this.changeTint, this);
  this.player2.events.onInputOut.add(this.removeTint, this);

  this.player3 = this.game.add.sprite(this.game.world.centerX + 200, this.game.world.centerY + 50, 'ship3');
  this.player3.anchor.setTo(0.5, 0.5);
  this.player3.scale.setTo(1.8, 1.8);
  this.player3.inputEnabled = true;
  this.player3.events.onInputDown.add(this.selectShip, this);
  this.player3.events.onInputOver.add(this.changeTint, this);
  this.player3.events.onInputOut.add(this.removeTint, this);
  

},

choose.update = function () {
  // Fire laser event
  for (var index in this.phaserKeys) {
	var key = this.phaserKeys[index];
	if (key.justDown) {
		this.startLevel1();
	}
  }
},

choose.goBack = function () {
  this.pimpMusic.stop();
	this.game.state.start('mainTitle');
}

choose.selectShip = function (sprite) {
  this.game.global.ship = sprite.key;
  this.goBack();
}

choose.changeTint = function (sprite) {
  sprite.tint = '0xcccccc';
}

choose.removeTint = function (sprite) {
  sprite.tint = '0xffffff';
}

module.exports = choose;
