var level3 = {};

level3.create = function () {

  this.game.global.life = 3;
  this.game.global.score = 0;
  this.playerBonus = '';
  this.bonusDropped = false;

  this.background = this.game.add.tileSprite(this.game.world.centerX - 10, this.game.world.centerY, 800, 600, 'background');
  this.background.anchor.setTo(0.5, 0.5);
  this.background.scale.setTo(3.4, 3.4);

  //this.scoreLabel = this.game.add.text(50, 50, 'score: 0',
		//{ font: '22px Arial', fill: '#ffffff' });

  this.levelLabel = this.game.add.text(50, 20, 'Level 3',
  		{ font: '22px Arial', fill: '#ffffff' });

  // Add player
  this.player = this.game.add.sprite(this.game.width/2, this.game.world.centerY + 100, 'player');
  this.player.anchor.setTo(0.5, 0.5);
  this.player.scale.setTo(0.5,0.5);
  this.game.physics.arcade.enable(this.player);
  this.player.body.updateBounds(this.player.scale.x, this.player.scale.y);
  this.player.body.drag.set(100);
  this.player.body.maxVelocity.set(600);
  this.player.invincible = false;

  // Add Boss
  this.boss = this.game.add.sprite(this.game.width/2, -50, 'boss');
  this.boss.anchor.setTo(0.5, 0.5);
  this.boss.scale.setTo(2,2);
  this.game.physics.arcade.enable(this.boss);
  this.boss.body.velocity.y = 50;
  this.boss.healthPoint = 500;


  this.life = this.game.add.sprite(this.game.width - 150, 40, 'life');
  this.life2 = this.game.add.sprite(this.game.width - 110, 40, 'life');
  this.life3 = this.game.add.sprite(this.game.width - 70, 40, 'life');

  this.emitter = this.game.add.emitter(0, 0, 15);
  this.emitter.makeParticles('pixel');
  this.emitter.setYSpeed(-150, 150);
  this.emitter.setXSpeed(-150, 150);
  this.emitter.setScale(2, 0, 2, 0, 800);
  this.emitter.gravity = 0;


  this.meteors = this.game.add.group();
  this.meteors.createMultiple(10, 'meteor');
  for (i = 0; i <this.meteors.length ; i++) {
  	this.meteors.children[i].scale.setTo(0.8,0.8);
  }
  this.meteors.enableBody = true;
  this.game.physics.arcade.enable(this.meteors);
  this.nextMeteor = 0;

  this.enemies = this.game.add.group();
  this.enemies.createMultiple(10, 'enemy');
  for (i = 0; i <this.enemies.length ; i++) {
	  this.enemies.children[i].scale.setTo(0.5,0.5);
  }
  this.enemies.enableBody = true;
  this.game.physics.arcade.enable(this.enemies);

  this.nextEnemy = 0;

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

    // Create group laser
    this.lasersBoss = this.game.add.group();
    this.lasersBoss.createMultiple(3, 'laser_green');
    //set the scale for each group children instead of the whole group
    for (i = 0; i <this.lasersBoss.length ; i++) {
  	  	this.lasersBoss.children[i].scale.setTo(0.5,0.5);
    }
    this.lasersBoss.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.resetLaser);
    this.lasersBoss.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
    this.lasersBoss.setAll('checkWorldBounds', true);
    this.game.physics.arcade.enable(this.lasersBoss);
    this.lasersBoss.enableBody = true;
 

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

level3.update = function () {

	this.background.tilePosition.y += 3;

	this.game.physics.arcade.overlap(this.player, this.enemies, this.playerDie,
		null, this);
	this.game.physics.arcade.overlap(this.player, this.boss, this.playerDie,
		null, this);
	this.game.physics.arcade.overlap(this.player, this.meteors, this.playerDie,
		null, this);
	this.game.physics.arcade.overlap(this.lasers, this.meteors, this.touchMeteor,
		null, this);
	this.game.physics.arcade.overlap(this.lasersBoss, this.meteors, this.touchMeteor,
		null, this);
	this.game.physics.arcade.overlap(this.player, this.lasersBoss, this.playerDie,
		null, this);
	this.game.physics.arcade.overlap(this.lasers, this.enemies, this.enemyDie,
		null, this);
	this.game.physics.arcade.overlap(this.lasers, this.boss, this.damageBoss,
		null, this);

	if(this.star!=null){
		this.game.physics.arcade.overlap(this.player, this.star, this.takeStar,
		null, this);
	}
	if(this.multiammo!=null){
		this.game.physics.arcade.overlap(this.player, this.multiammo, this.takeMultiAmmo,
		null, this);
	}

	if(this.boss.y > 200){
		this.boss.y = 200;
	}

	// Meteors spawn
	if (this.nextMeteor < this.game.time.now) {
		var start = 5000, end = 3000, score = 100;
		var delay = Math.max(
		start - (start - end) * this.game.global.score / score, end);
		this.addMeteor();
		this.nextMeteor = this.game.time.now + delay;
	}

	// Ennemies spawn
	/*if (this.nextEnemy < this.game.time.now) {
		var start = 1000, end = 500, score = 100;
		var delay = Math.max(
		start - (start - end) * this.game.global.score / score, end);
		this.addEnemy();
		this.nextEnemy = this.game.time.now + delay;
	}*/

	// Player movement
    if ( (cursors.up.isDown || this.wasd.up.isDown)  && this.player.body.y > 200)
    {
		this.player.body.acceleration.y = -300;
		this.player.angle = 0;
    }
    else if ( (cursors.down.isDown || this.wasd.down.isDown) && this.player.body.y < 500)
    {
        this.player.body.acceleration.y = 300;
		this.player.angle = 0;
    }
    else if (cursors.left.isDown || this.wasd.left.isDown)
    {
        this.player.body.acceleration.x = -300;
        this.player.body.acceleration.y = 0;
        this.player.angle = -10;
    }
    else if (cursors.right.isDown || this.wasd.right.isDown)
    {
        this.player.body.acceleration.x = 300;
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
	if(this.player.alive){
		for (var index in this.phaserKeys) {
			var key = this.phaserKeys[index];
			if (key.justDown) {
				this.fireLaser();
			}
		}
	}

	if(this.boss.alive){
		this.fireLaserBoss();
	}

	if(this.shield != null){
		this.game.physics.arcade.overlap(this.shield, this.enemies, this.enemyDie,
			null, this);
		this.game.physics.arcade.overlap(this.shield, this.meteors, this.hitMeteor,
			null, this);
		this.game.world.wrap(this.shield, 0, true);
		this.game.physics.arcade.moveToObject(this.shield, this.player, 50, 50);
	}
},

level3.finishGame = function () {
	this.game.state.start('finish');
},

level3.resetLaser = function (laser) {
	laser.kill();
},

level3.fireLaser = function () {
	if(this.playerBonus == 'multiammo'){
		var laser2 = this.lasers.getFirstExists(false);
		if (laser2) {
			this.laserSound.play();
			if(this.player.angle == 10){
				laser2.reset(this.player.x - 15, this.player.y - 15);
			}
			else if (this.player.angle == -10){
				laser2.reset(this.player.x - 25, this.player.y - 15);
			}
			else{
				laser2.reset(this.player.x - 20, this.player.y - 20);
			}
			laser2.body.velocity.y = -500;
			laser2.angle = -30;
			this.physics.arcade.velocityFromAngle(-120, 300, laser2.body.velocity);
		}	
		var laser3 = this.lasers.getFirstExists(false);
		if (laser3) {
			this.laserSound.play();
			if(this.player.angle == 10){
				laser3.reset(this.player.x + 25, this.player.y - 15);
			}
			else if (this.player.angle == -10){
				laser3.reset(this.player.x + 15, this.player.y - 15);
			}
			else{
				laser3.reset(this.player.x + 20, this.player.y - 20);
			}
			laser3.body.velocity.y = -500;
			laser3.angle = +30;
			this.physics.arcade.velocityFromAngle(-50, 300, laser3.body.velocity);
		}

	}
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
		laser.angle = 0;
	}
},
level3.fireLaserBoss = function () {
	/*var laserBoss2 = this.lasers.getFirstExists(false);
	if (laserBoss2) {
		this.laserSound.play();
		laserBoss2.reset(this.boss.x - 20, this.boss.y - 20);
		laserBoss2.body.velocity.y = 500;
		laserBoss2.angle = -30;
		this.physics.arcade.velocityFromAngle(-120, 300, laserBoss2.body.velocity);
	}	
	var laserBoss3 = this.lasers.getFirstExists(false);
	if (laserBoss3) {
		this.laserSound.play();
		laserBoss3.reset(this.boss.x + 20, this.boss.y - 20);
		laserBoss3.body.velocity.y = 500;
		laserBoss3.angle = +30;
		this.physics.arcade.velocityFromAngle(-50, 300, laserBoss3.body.velocity);
	}*/
	var laserBoss = this.lasersBoss.getFirstExists(false);
	if (laserBoss) {
		this.laserSound.play();
		laserBoss.reset(this.boss.x, this.boss.y + 20);

		//laserBoss.body.velocity.y = 500;
		angleLaser = this.game.rnd.pick([45, 75, 90, 105, 120, 140]);
		laserBoss.angle = angleLaser - 80;
		this.physics.arcade.velocityFromAngle(angleLaser, 300, laserBoss.body.velocity);
	}
},
level3.takeStar = function(player, star) {

	this.coinSound.play();
	star.kill();

	this.playerBonus = 'shield';

	this.shield = this.game.add.sprite(this.player.x + 30, this.player.y - 30, 'shield');
	this.game.physics.arcade.enable(this.shield);
	this.shield.anchor.setTo(0.5, 0.5);

	this.game.time.events.add(10000, this.stopBonus, this);
},

level3.takeMultiAmmo = function(player, bonus) {

	this.coinSound.play();
	bonus.kill();
	this.playerBonus = 'multiammo';
	this.game.time.events.add(10000, this.stopBonus, this);
},
level3.addEnemy = function() {
	var enemy = this.enemies.getFirstDead();
	if (!enemy) {
		return;
	}
	enemy.anchor.setTo(0.5, 1);
	enemy.healthPoint = 20;
	enemy.reset(this.game.rnd.pick([100, 200, 300, 400, 500, 600, 700]), 0);

	enemy.rotation = this.game.physics.arcade.angleBetween(enemy, this.player) - 1.5;
	this.game.physics.arcade.moveToObject(enemy, this.player, 200);
	enemy.checkWorldBounds = true;
	enemy.outOfBoundsKill = true;
},
level3.addMeteor = function() {
	var meteor = this.meteors.getFirstDead();
	if (!meteor) {
		return;
	}

	var key = this.game.rnd.pick(['meteor_grey_med', 'meteor_grey', 'meteor_med', 'meteor']);
	var angle = this.game.rnd.pick([0,20,40,60,80,100]);
	meteor.key = key;
	meteor.loadTexture(key, 0);
	meteor.anchor.setTo(0.5, 1);
	meteor.angle = angle;

	var direction = this.game.rnd.pick(['horizontal', 'vertical']); 
	if(direction == 'vertical'){
		meteor.reset(this.game.rnd.pick([200, 300, 400, 500, 600]), 0);
		meteor.body.velocity.y = this.game.rnd.pick([100, 150]);
		meteor.body.velocity.x = this.game.rnd.pick([0, 50, 100]) * this.game.rnd.pick([-1, 1]);
	}
	else{
		meteor.reset(0, this.game.rnd.pick([200, 300, 400]));
		meteor.body.velocity.y = this.game.rnd.pick([25, 50, 75]) * this.game.rnd.pick([-1, 1]);
		meteor.body.velocity.x = this.game.rnd.pick([100, 150]);
	}
	
	meteor.checkWorldBounds = true;
	meteor.outOfBoundsKill = true;
},
level3.playerDie = function() {

	if(!this.player.invincible){
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
		        this.game.time.events.add(1000, this.startMenu, this);
		        break;
		}
		this.stopBonus();
		this.player.alpha = 0.1;
		this.toggleInvincible();
		this.game.time.events.add(2500, this.toggleInvincible, this);
	}
},
level3.enemyDie = function(sprite, enemy) {
	enemyX = enemy.x;
	enemyY = enemy.y;

	if(sprite.key == 'laser'){
		sprite.kill();
	}

	enemy.healthPoint -= 10;

	if(enemy.healthPoint <= 0){
		enemy.kill();

		number = this.game.rnd.pick([1, 2, 3 , 4, 5]);
		if(this.playerBonus == '' && this.bonusDropped == false){
			switch(number){
				case 5 :
					this.bonusDropped = true;
					this.star = this.game.add.sprite(enemyX, enemyY, 'star');
					this.star.anchor.setTo(0.5, 0.5);
					this.star.scale.setTo(0.8, 0.8);
					this.game.physics.arcade.enable(this.star);
					break;
				case 4 :
					this.bonusDropped = true;
					this.multiammo = this.game.add.sprite(enemyX, enemyY, 'multiammo');
					this.multiammo.anchor.setTo(0.5, 0.5);
					this.multiammo.scale.setTo(0.8, 0.8);
					this.game.physics.arcade.enable(this.multiammo);
					break;
				default: 
					// À voir
					break;    
			}
		}

		this.increaseScore(10);

		this.emitter.x = enemy.x;
		this.emitter.y = enemy.y;
		this.emitter.start(true, 800, null, 15);
	}

},
level3.hitMeteor = function(shield, meteor) {
	meteor.kill();
},
level3.resetPlayer = function() {
	this.player.reset(this.game.width/2, this.game.world.centerY + 100);
},
level3.startMenu = function() {
	this.game.state.start('mainTitle');
},
level3.stopBonus = function() {
	if(this.shield != null){
		this.shield.kill();
	}
	this.playerBonus = '';
	this.bonusDropped = false;
},
level3.toggleInvincible = function() {
	this.player.invincible = !this.player.invincible;
	if(!this.player.invincible){
		this.player.alpha = 1;
	}
},
level3.touchMeteor = function(laser, meteor) {
	laser.kill();
},
level3.damageBoss = function(boss, laser) {
	laser.kill();

	this.boss.healthPoint -= 10;
	if(this.boss.healthPoint <= 0){
		boss.kill();
		this.finishGame();
	}
}

module.exports = level3;
