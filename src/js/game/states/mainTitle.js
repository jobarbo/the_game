var mainTitle = {};

mainTitle.create = function () {
	
  this.game.physics.startSystem(Phaser.Physics.P2JS);

  var background = this.game.add.sprite(this.game.world.centerX - 10, this.game.world.centerY, 'background');
  background.anchor.setTo(0.5, 0.5);
  background.scale.setTo(3.4, 3.4);

  var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 100, 'logo');
  logo.anchor.setTo(0.5, 0.5);

  this.button = this.game.add.button(this.game.world.centerX - 120, this.game.world.centerY + 120, 'button', this.startLevel1,
		this);

  this.startLabel = this.game.add.text(this.game.world.centerX - 40, this.game.world.centerY + 127, 'Jouer',
		{ font: '22px Arial', fill: '#000000' });

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

  var text = 'score: ' + this.game.global.score + '\nbest score: ' +
  localStorage.getItem('bestScore');
  var scoreLabel = this.game.add.text(this.game.width/2, this.game.height/2+ 90, text,
  { font: '25px Arial', fill: '#ffffff', align: 'center' });
  scoreLabel.anchor.setTo(0.5, 0.5);

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
	this.game.state.start('level3');
}

module.exports = mainTitle;
