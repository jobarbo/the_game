var level1 = {};

level1.create = function () {

  var background = this.game.add.sprite(this.game.world.centerX - 10, this.game.world.centerY, 'background');
  background.anchor.setTo(0.5, 0.5);
  background.scale.setTo(3.4, 3.4);

  this.scoreLabel = this.game.add.text(50, 50, 'score: 0',
		{ font: '22px Arial', fill: '#ffffff' });

  // Add player
  this.player = this.game.add.sprite(this.game.width/2, this.game.world.centerY + 100, 'player');
  this.player.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enable(this.player);

  // Display the coin
  this.coin = this.game.add.sprite(60, 240, 'coin');
  // Add Arcade physics to the coin
  this.game.physics.arcade.enable(this.coin);
  // Set the anchor point to its center
  this.coin.anchor.setTo(0.5, 0.5);
  this.coin.scale.setTo(0.4, 0.4);

  this.coinSound = this.game.add.audio('coin');

  // Create group laser
  lasers = this.game.add.group();
  lasers.enableBody = true;
  lasers.physicsBodyType = Phaser.Physics.ARCADE;
  lasers.createMultiple(20, 'laser');
  lasers.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.resetLaser);
  lasers.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
  lasers.setAll('checkWorldBounds', true);

  // add Spacebar key
  this.keys = [Phaser.KeyCode.SPACEBAR];
  this.phaserKeys = this.game.input.keyboard.addKeys(this.keys);
  this.game.input.keyboard.addKeyCapture(this.keys);

  cursors = this.game.input.keyboard.createCursorKeys();
},

level1.update = function () {

	// Player movement
    if (cursors.up.isDown && this.player.body.y > 200)
    {
        this.player.body.velocity.y = -300;
    }
    else if (cursors.down.isDown && this.player.body.y < 500)
    {
        this.player.body.velocity.y = 300;
    }
    else if (cursors.left.isDown)
    {
        this.player.body.velocity.x = -300;
        this.player.body.velocity.y = 0;
        this.player.angle = -20;
    }
    else if (cursors.right.isDown)
    {
        this.player.body.velocity.x = 300;
        this.player.body.velocity.y = 0;
        this.player.angle = 20;
    }
    else
    {
		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;
		this.player.angle = 0;
	}

	this.game.world.wrap(this.player, 0, true);

	// Fire laser event
	for (var index in this.phaserKeys) {
		var key = this.phaserKeys[index];
		if (key.justDown) {
			this.fireLaser();
		}
	}

	this.game.physics.arcade.overlap(this.player, this.coin, this.takeCoin,
	null, this);
   
},

level1.startLevel2 = function () {
	this.game.state.start('level2');
},

level1.resetLaser = function (laser) {
	laser.kill();
},

level1.fireLaser = function () {
	var laser = lasers.getFirstExists(false);
	if (laser) {
		if(this.player.angle == 20){
			laser.reset(this.player.x + 20, this.player.y - 20);
		}
		else if (this.player.angle == -20){
			laser.reset(this.player.x - 20, this.player.y - 20);
		}
		else{
			laser.reset(this.player.x, this.player.y - 20);
		}
		laser.body.velocity.y = -500;
	}
},

level1.takeCoin = function(player, coin) {
	this.game.global.score += 5;
	// Use the new score variable
	this.scoreLabel.text = 'score: ' + this.game.global.score;

	this.coinSound.play();

	// Scale the coin to 0 to make it invisible
	this.coin.scale.setTo(0, 0);
	// Grow the coin back to its original scale in 300ms
	this.game.add.tween(this.coin.scale).to({x: 0.4, y: 0.4}, 300).start();

	this.game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 100)
	.yoyo(true).start();


	// Change the coin position
	this.updateCoinPosition();
},

level1.updateCoinPosition = function() {
	// Store all the possible coin positions in an array
	var coinPosition = [
	{x: 140, y: 210}, {x: 360, y: 210}, // Top row
	{x: 60, y: 240}, {x: 440, y: 240}, // Middle row
	{x: 130, y: 300}, {x: 370, y: 300} // Bottom row
	];
	// Remove the current coin position from the array
	// Otherwise the coin could appear at the same spot twice in a row
	for (var i = 0; i < coinPosition.length; i++) {
	if (coinPosition[i].x == this.coin.x) {
	coinPosition.splice(i, 1);
	}
	}
	// Randomly select a position from the array with 'this.game.rnd.pick'
	var newPosition = this.game.rnd.pick(coinPosition);
	// Set the new position of the coin
	this.coin.reset(newPosition.x, newPosition.y);
},

module.exports = level1;
