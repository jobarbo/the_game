var level1 = {};

level1.create = function () {

  var background = this.game.add.sprite(this.game.world.centerX - 10, this.game.world.centerY, 'background');
  background.anchor.setTo(0.5, 0.5);
  background.scale.setTo(3.4, 3.4);

  // Add player
  this.player = this.game.add.sprite(this.game.width/2, this.game.world.centerY + 100, 'player');
  this.player.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enable(this.player);

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

module.exports = level1;
