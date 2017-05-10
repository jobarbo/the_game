var level1 = {};

level1.create = function () {

  this.game.global.life = 3;
  this.playerShield = false;
  this.shieldDropped = false;

  var background = this.game.add.sprite(this.game.world.centerX - 10, this.game.world.centerY, 'background');
  background.anchor.setTo(0.5, 0.5);
  background.scale.setTo(3.4, 3.4);

  this.scoreLabel = this.game.add.text(50, 50, 'score: 0',
		{ font: '22px Arial', fill: '#ffffff' });

  // Add player
  this.player = this.game.add.sprite(this.game.width/2, this.game.world.centerY + 100, 'player');
  this.player.anchor.setTo(0.5, 0.5);
  this.player.scale.setTo(0.5,0.5);
  this.game.physics.arcade.enable(this.player);
  this.player.body.updateBounds(this.player.scale.x, this.player.scale.y);
  this.player.body.drag.set(100);
  this.player.body.maxVelocity.set(600);


  this.life = this.game.add.sprite(this.game.width - 150, 40, 'life');
  this.life2 = this.game.add.sprite(this.game.width - 110, 40, 'life');
  this.life3 = this.game.add.sprite(this.game.width - 70, 40, 'life');

  this.emitter = this.game.add.emitter(0, 0, 15);
  this.emitter.makeParticles('pixel');
  this.emitter.setYSpeed(-150, 150);
  this.emitter.setXSpeed(-150, 150);
  this.emitter.setScale(2, 0, 2, 0, 800);
  this.emitter.gravity = 0;

  this.enemies = this.game.add.group();
  this.enemies.createMultiple(10, 'enemy');
  //set the scale for each group children instead of the whole group
  for (i = 0; i <this.enemies.length ; i++) {
	  this.enemies.children[i].scale.setTo(0.5,0.5);
  }
  this.enemies.enableBody = true;
  this.game.physics.arcade.enable(this.enemies);

  this.nextEnemy = 0;

  // Display the coin
  this.coin = this.game.add.sprite(60, 240, 'coin');

  // Set the anchor point to its center
  this.coin.anchor.setTo(0.5, 0.5);
  this.coin.scale.setTo(0.3, 0.3);
  // Add Arcade physics to the coin
  this.game.physics.arcade.enable(this.coin);

  /*this.coin.animations.add('spin', [
  	'images/collectables/coin/gold_1.png', 
  	'images/collectables/coin/gold_2.png', 
  	'images/collectables/coin/gold_3.png',
  	'images/collectables/coin/gold_4.png'],
    15, true);
  this.coin.animations.play('spin');*/

  this.coinSound = this.game.add.audio('coin');
  this.laserSound = this.game.add.audio('laser');

  // Create group laser
  this.lasers = this.game.add.group();

  this.lasers.createMultiple(20, 'laser');
  //set the scale for each group children instead of the whole group
  for (i = 0; i <this.lasers.length ; i++) {
	  	this.lasers.children[i].scale.setTo(0.5,0.5);
  }
  this.lasers.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.resetLaser);
  this.lasers.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
  this.lasers.setAll('checkWorldBounds', true);
  this.game.physics.arcade.enable(this.lasers);
  this.lasers.enableBody = true;
 

  // add Spacebar key
  this.keys = [Phaser.KeyCode.SPACEBAR];
  this.phaserKeys = this.game.input.keyboard.addKeys(this.keys);
  this.game.input.keyboard.addKeyCapture(this.keys);

  this.wasd = {
  	up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
  	down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
  	left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
  	right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
  };

  cursors = this.game.input.keyboard.createCursorKeys();

  this.shield = null;
},

level1.update = function () {

	this.game.physics.arcade.overlap(this.player, this.enemies, this.playerDie,
		null, this);
	this.game.physics.arcade.overlap(this.lasers, this.enemies, this.enemyDie,
		null, this);
	this.game.physics.arcade.overlap(this.player, this.coin, this.takeCoin,
	null, this);

	if(this.star!=null){
		this.game.physics.arcade.overlap(this.player, this.star, this.takeStar,
		null, this);
	}

	if (this.nextEnemy < this.game.time.now) {
		// Define our variables
		var start = 500, end = 200, score = 100;
		// Formula to decrease the delay between enemies over time
		// At first it's 4000ms, then slowly goes to 1000ms
		var delay = Math.max(
		start - (start - end) * this.game.global.score / score, end);
		// Create a new enemy and update the 'nextEnemy' time
		this.addEnemy();
		this.nextEnemy = this.game.time.now + delay;
	}

	// Player movement
	console.log(this.player.body.y);
    if ( (cursors.up.isDown || this.wasd.up.isDown)  && this.player.body.y > 200)
    {
		this.player.body.acceleration.y = -400;
		this.player.angle = 0;
    }
    else if ( (cursors.down.isDown || this.wasd.down.isDown) && this.player.body.y < 500)
    {
        this.player.body.acceleration.y = 400;
		this.player.angle = 0;
    }
    else if (cursors.left.isDown || this.wasd.left.isDown)
    {
        this.player.body.acceleration.x = -400;
        this.player.body.acceleration.y = 0;
        this.player.angle = -10;
    }
    else if (cursors.right.isDown || this.wasd.right.isDown)
    {
        this.player.body.acceleration.x = 400;
        this.player.body.acceleration.y = 0;
        this.player.angle = 10;
    }
    else
    {
		this.player.body.acceleration.x = 0;
		this.player.body.acceleration.y = 0;
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

	if(this.shield != null){
		this.game.physics.arcade.overlap(this.shield, this.enemies, this.enemyDie,
			null, this);
		this.game.world.wrap(this.shield, 0, true);
		this.game.physics.arcade.moveToObject(this.shield, this.player, 50, 50);
	}
},

level1.startLevel2 = function () {
	this.game.state.start('level2');
},

level1.resetLaser = function (laser) {
	laser.kill();
},

level1.fireLaser = function () {
	var laser = this.lasers.getFirstExists(false);
	if (laser) {
		this.laserSound.play();
		if(this.player.angle == 10){
			laser.reset(this.player.x + 5, this.player.y - 20);
		}
		else if (this.player.angle == -10){
			laser.reset(this.player.x - 5, this.player.y - 20);
		}
		else{
			laser.reset(this.player.x, this.player.y - 20);
		}
		laser.body.velocity.y = -500;
	}
},

level1.takeCoin = function(player, coin) {
	this.game.global.score += 5;
	this.scoreLabel.text = 'score: ' + this.game.global.score;

	this.coinSound.play();
	this.coin.scale.setTo(0, 0);
	this.game.add.tween(this.coin.scale).to({x: 0.4, y: 0.4}, 300).start();

	this.game.add.tween(this.player.scale).to({x: 0.7, y: 0.7}, 100)
	.yoyo(true).start();

	this.updateCoinPosition();
},

level1.takeStar = function(player, star) {

	this.coinSound.play();
	star.kill();

	this.playerShield = true;

	this.shield = this.game.add.sprite(this.player.x + 30, this.player.y - 30, 'shield');
	this.game.physics.arcade.enable(this.shield);
	this.shield.anchor.setTo(0.5, 0.5);

	this.game.time.events.add(10000, this.removeShield, this);

},

level1.updateCoinPosition = function() {
	var coinPosition = [
		{x: 140, y: 210}, {x: 360, y: 210},
		{x: 60, y: 340}, {x: 440, y: 340},
		{x: 130, y: 400}, {x: 370, y: 400}
	];
	for (var i = 0; i < coinPosition.length; i++) {
		if (coinPosition[i].x == this.coin.x) {
			coinPosition.splice(i, 1);
		}
	}
	var newPosition = this.game.rnd.pick(coinPosition);
	this.coin.reset(newPosition.x, newPosition.y);
},
level1.addEnemy = function() {
	var enemy = this.enemies.getFirstDead();
	if (!enemy) {
		return;
	}
	enemy.anchor.setTo(0.5, 1);
	enemy.reset(this.game.rnd.pick([100, 200, 300, 400, 500, 600, 700]), 0);
	enemy.body.velocity.y = this.game.rnd.pick([100, 200]) * this.game.rnd.pick([-1, 1]);
	enemy.body.velocity.x = this.game.rnd.pick([0, 50]) * this.game.rnd.pick([-1, 1]);
	enemy.checkWorldBounds = true;
	enemy.outOfBoundsKill = true;
},
level1.playerDie = function() {

	this.emitter.x = this.player.x;
	this.emitter.y = this.player.y;
	this.emitter.start(true, 800, null, 15);

	this.player.kill();

	this.game.global.life -= 1;

	switch(this.game.global.life) {
	    case 2:
	    	this.life3.kill();
	        this.game.time.events.add(1000, this.resetPlayer, this);
	        break;
	    case 1:
	    	this.life2.kill();
	        this.game.time.events.add(1000, this.resetPlayer, this);
	        break;
	    case 0:
	    	this.life.kill();
			this.game.global.score = 0;
	        this.game.time.events.add(1000, this.startMenu, this);
	        break;
	}


},
level1.enemyDie = function(laser, enemy) {
	enemyX = enemy.x;
	enemyY = enemy.y;
	enemy.kill();

	number = this.game.rnd.pick([1, 2, 3 , 4, 5]);

	if(number == 5 && this.playerShield == false && this.shieldDropped == false){
		// Display the star

		this.shieldDropped = true;
		this.star = this.game.add.sprite(enemyX, enemyY, 'star');

		// Set the anchor point to its center
		this.star.anchor.setTo(0.5, 0.5);
		this.star.scale.setTo(0.8, 0.8);
		// Add Arcade physics to the star
		this.game.physics.arcade.enable(this.star);
	}

	this.game.global.score += 10;
	this.scoreLabel.text = 'score: ' + this.game.global.score;

	this.emitter.x = enemy.x;
	this.emitter.y = enemy.y;
	this.emitter.start(true, 800, null, 15);

},
level1.resetPlayer = function() {
	this.player.reset(this.game.width/2, this.game.world.centerY + 100);
},
level1.startMenu = function() {
	this.game.state.start('mainTitle');
},
level1.removeShield = function() {
	this.shield.kill();
	this.playerShield = false;
	this.shieldDropped = false;
},


module.exports = level1;
