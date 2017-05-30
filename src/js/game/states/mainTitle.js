var mainTitle = {};

mainTitle.create = function () {
	
  this.game.physics.startSystem(Phaser.Physics.P2JS);

  var background = this.game.add.sprite(this.game.world.centerX - 10, this.game.world.centerY, 'background');
  background.anchor.setTo(0.5, 0.5);
  background.scale.setTo(3.4, 3.4);

  // add Spacebar key
  this.keys = [Phaser.KeyCode.SPACEBAR];
  this.phaserKeys = this.game.input.keyboard.addKeys(this.keys);
  this.game.input.keyboard.addKeyCapture(this.keys);

  // Best score
  if (!localStorage.getItem('bestScore')) {
    // Then set the best score to 0
    localStorage.setItem('bestScore', 0);
  }
  if (this.game.global.score > localStorage.getItem('bestScore')) {
    localStorage.setItem('bestScore', this.game.global.score);
  }

  var highscoreLabel = this.game.add.text(this.game.world.centerX, 60, 'High score: ' + localStorage.getItem('bestScore'),
    { font: '30px Arial', fill: '#ffffff' });

  /*var scoreLabel = this.game.add.text(50, 20, 'Score: ' + this.game.global.score,
  { font: '22px Arial', fill: '#ffffff', align: 'center' });
  scoreLabel.anchor.setTo(0.5, 0.5);*/

  highscoreLabel.anchor.setTo(0.5, 0.5);

  this.introMusic = this.game.add.audio('intro');
  this.introMusic.volume = 0.7;
  this.introMusic.play();

  this.startLabel = this.game.add.text(this.game.world.centerX, 250, 'Play',
    { font: '40px Arial', fill: '#ffffff' });
  this.startLabel.anchor.setTo(0.5, 0.5);
  this.startLabel.inputEnabled = true;
  this.startLabel.events.onInputDown.add(this.startLevel1, this);
  this.startLabel.events.onInputOver.add(this.overText, this);
  this.startLabel.events.onInputOut.add(this.outText, this);

  this.chooseShipLabel = this.game.add.text(this.game.world.centerX, 320, 'Choose Ship',
    { font: '40px Arial', fill: '#ffffff' });
  this.chooseShipLabel.anchor.setTo(0.5, 0.5);
  this.chooseShipLabel.inputEnabled = true;
  this.chooseShipLabel.events.onInputDown.add(this.chooseShip, this);
  this.chooseShipLabel.events.onInputOver.add(this.overText, this);
  this.chooseShipLabel.events.onInputOut.add(this.outText, this);

  this.muteButton = this.game.add.button(20, 20, 'mute', this.toggleSound,
  this);
  this.muteButton.frame = this.game.sound.mute ? 1 : 2;

},

mainTitle.update = function () {
  // Fire laser event
  for (var index in this.phaserKeys) {
	var key = this.phaserKeys[index];
	if (key.justDown) {
		this.startLevel1();
	}
  }
},

mainTitle.startLevel1 = function () {
  this.introMusic.stop();
	this.game.state.start('level1');
},

mainTitle.chooseShip = function () {
  this.introMusic.stop();
  this.game.state.start('choose');
},

mainTitle.overText = function (sprite) {
  sprite.scale.setTo(1.2, 1.2);
},

mainTitle.outText = function (sprite) {
  sprite.scale.setTo(1, 1);
},

mainTitle.toggleSound = function() {
  this.game.sound.mute = !this.game.sound.mute;
  this.muteButton.frame = this.game.sound.mute ? 1 : 2;
},


module.exports = mainTitle;
