var tuto = {};

tuto.create = function () {

  this.background = this.game.add.tileSprite(this.game.world.centerX - 10, this.game.world.centerY, 800, 600, 'background');
  this.background.anchor.setTo(0.5, 0.5);
  this.background.scale.setTo(3.4, 3.4);

  this.chooseShipLabel = this.game.add.text(this.game.world.centerX, 130, 'Bonus',
    { font: '60px Arial', fill: '#ffffff' });
  this.chooseShipLabel.anchor.setTo(0.5, 0.5);

  this.backLabel = this.game.add.text(150, 500, 'Retour',
    { font: '28px Arial', fill: '#ffffff' });
  this.backLabel.anchor.setTo(0.5, 0.5);
  this.backLabel.inputEnabled = true;
  this.backLabel.events.onInputDown.add(this.goBack, {game: this.game});
  this.backLabel.events.onInputOver.add(this.overText, this);
  this.backLabel.events.onInputOut.add(this.outText, this);


  this.muteButton = this.game.add.button(20, 20, 'mute', this.toggleSound,
  this);
  this.muteButton.frame = this.game.sound.mute ? 1 : 2;


  this.missile = this.game.add.sprite(260, 250, 'missile');
  this.missile.anchor.setTo(0.5, 0.5);
  this.missile.scale.setTo(1.5, 1.5);

  var tween = this.game.add.tween(this.missile.scale).to( { x: 1.05, y: 1.05 }, 500, "Linear", true);
      tween.repeat(15, 500);

    text = 'Le missile tête chercheuse fonce directement sur l\'ennemi le plus proche, easy peasy !';
  this.missileLabel = this.game.add.text(500, 245, text,
    { font: '16px Arial', fill: '#ffffff' });
  this.missileLabel.wordWrap = true;
  this.missileLabel.wordWrapWidth = 300;
  this.missileLabel.anchor.setTo(0.5, 0.5);

  this.multiammo = this.game.add.sprite(260, 350, 'multiammo');
  this.multiammo.anchor.setTo(0.5, 0.5);
  this.multiammo.scale.setTo(1.5, 1.5);

  var tween = this.game.add.tween(this.multiammo.scale).to( { x: 1.05, y: 1.05 }, 500, "Linear", true);
      tween.repeat(15, 500);

    text = 'Multiplie vos lasers   \\ | /';
  this.multiammoLabel = this.game.add.text(440, 355, text,
    { font: '16px Arial', fill: '#ffffff' });
  this.multiammoLabel.wordWrap = true;
  this.multiammoLabel.wordWrapWidth = 300;
  this.multiammoLabel.anchor.setTo(0.5, 0.5);
  
},

tuto.update = function () {
  this.background.tilePosition.y += 1;
  
},

tuto.goBack = function () {
  //this.pimpMusic.stop();
	this.game.state.start('mainTitle');
},

tuto.toggleSound = function() {
  this.game.sound.mute = !this.game.sound.mute;
  this.muteButton.frame = this.game.sound.mute ? 1 : 2;
},

tuto.overText = function (sprite) {
  sprite.scale.setTo(1.2, 1.2);
},

tuto.outText = function (sprite) {
  sprite.scale.setTo(1, 1);
},

module.exports = tuto;
