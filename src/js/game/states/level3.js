var level3 = {};

level3.create = function () {

  this.game.global.life = 3;
  this.game.global.score = 0;
  this.playerBonus = '';
  this.bonusDropped = false;
  this.bonusTimerSize = 1;
  this.shield = null;
  this.nextShotPowerUpAt = 0;
  this.practiceMode = false;
  this.currentLevel = 3;
  this.enemyLife = 20;
  this.bossLife = 500;
  this.game.time.slowMotion = 1.0;
  this.delayMeteor = 3000;
  this.delayEnemy = 4000;
  this.finish = false;

  // Background
  this.background = this.game.add.tileSprite(this.game.world.centerX - 10, this.game.world.centerY, 800, 600, 'background');
  this.background.anchor.setTo(0.5, 0.5);
  this.background.scale.setTo(3.4, 3.4);

  // Labels
  this.scoreLabel = this.game.add.text(50, 20, 'Score: 0',
		{ font: '22px Arial', fill: '#ffffff' });
  this.levelLabel = this.game.add.text(this.game.world.centerX, 20, 'Level ' + this.currentLevel,
  		{ font: '22px Arial', fill: '#ffffff' });
  this.bonusLabel = this.game.add.text(50, 50, 'Bonus Time: ',
  		{ font: '22px Arial', fill: '#ffffff' });
  this.bonusLabel.visible = false;

    this.finishLabel = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'YOU WIN',
  		{ font: '40px Arial', fill: '#ffffff' });
    this.finishLabel.anchor.setTo(0.5,0.5);
    this.finishLabel.alpha = 0;

  // Add player
  this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 100, 'player');
  this.player.anchor.setTo(0.5, 0.5);
  this.player.scale.setTo(0.5,0.5);
  this.game.physics.arcade.enable(this.player);
  this.player.body.drag.set(800);
  this.player.body.maxVelocity.set(500);
  this.player.invincible = false;
  this.player.body.collideWorldBounds = true;

  // Bonus timer
  var bmd = this.game.add.bitmapData(100, 8);
  bmd.ctx.beginPath();
  bmd.ctx.rect(0, 0, 100, 8);
  bmd.ctx.fillStyle = '#ffffff';
  bmd.ctx.fill();
  this.bonusTimer = this.game.add.sprite(230, 63, bmd);
  this.bonusTimer.anchor.setTo(0.5, 0.5);
  this.bonusTimer.visible = false;

  // Add Friend
  this.friend = this.game.add.sprite(-100, this.game.world.centerY + 100, 'friend');
  this.friend.anchor.setTo(0.5, 0.5);
  this.friend.scale.setTo(0.3,0.3);
  this.game.physics.arcade.enable(this.friend);
  this.friend.follow = false;

  // Add Boss
  this.boss = this.game.add.sprite(this.game.width/2, -50, 'boss');
  this.boss.anchor.setTo(0.5, 0.5);
  this.boss.scale.setTo(2,2);
  this.game.physics.arcade.enable(this.boss);
  this.boss.body.velocity.y = 50;
  this.boss.healthPoint = this.bossLife;

  // Life
  this.life = this.game.add.sprite(this.game.width - 150, 40, 'life');
  this.life2 = this.game.add.sprite(this.game.width - 110, 40, 'life');
  this.life3 = this.game.add.sprite(this.game.width - 70, 40, 'life');

  // Emitter
  this.emitter = this.game.add.emitter(0, 0, 15);
  this.emitter.makeParticles('pixel');
  this.emitter.setYSpeed(-150, 150);
  this.emitter.setXSpeed(-150, 150);
  this.emitter.setScale(2, 0, 2, 0, 800);
  this.emitter.gravity = 0;

  // Meteors
  this.meteors = this.game.add.group();
  this.meteors.createMultiple(10, 'meteor');
  for (i = 0; i <this.meteors.length ; i++) {
  	this.meteors.children[i].scale.setTo(0.8,0.8);
  }
  this.meteors.enableBody = true;
  this.game.physics.arcade.enable(this.meteors);
  this.nextMeteor = 0;

  // Ennemies
  this.enemies = this.game.add.group();
  this.enemies.createMultiple(10, 'enemy');
  for (i = 0; i <this.enemies.length ; i++) {
	  this.enemies.children[i].scale.setTo(0.5,0.5);
  }
  this.enemies.enableBody = true;
  this.game.physics.arcade.enable(this.enemies);
  this.nextEnemy = 0;

  // Sounds
  this.coinSound = this.game.add.audio('coin');
  this.laserSound = this.game.add.audio('laser');

  // Lasers

  this.weapon = this.game.add.weapon(30, 'laser_green');
  this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
  this.weapon.bulletSpeed = 400;
  this.weapon.fireRate = 200;
  this.weapon.fireAngle = 270;
  this.game.physics.arcade.enable(this.weapon);
  this.weapon.trackSprite(this.player, 0, 0, false);
  this.weapon.bullets.forEach((b) => {
  	b.scale.setTo(0.5, 0.5);
	b.body.updateBounds();
  }, this);
  this.weapon.bulletAngleOffset = 90;

  this.weaponFriend = this.game.add.weapon(10, 'laser');
  this.weaponFriend.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
  this.weaponFriend.bulletSpeed = 400;
  this.weaponFriend.fireRate = 200;
  this.weaponFriend.fireAngle = 270;
  this.weaponFriend.bulletAngleVariance  = 10;
  this.game.physics.arcade.enable(this.weaponFriend);
  this.weaponFriend.trackSprite(this.friend, 0, 0, false);
  this.weaponFriend.bullets.forEach((b) => {
  	b.scale.setTo(0.5, 0.5);
  	b.body.updateBounds();
  }, this);
  this.weaponFriend.bulletAngleOffset = 90;

    // Create group laser
    this.lasersBoss = this.game.add.group();
    this.lasersBoss.createMultiple(3, 'laser_green');
    //set the scale for each group children instead of the whole group
    for (i = 0; i <this.lasersBoss.length ; i++) {
  	  	this.lasersBoss.children[i].scale.setTo(0.5,0.5);
  	  	this.lasersBoss.children[i].anchor.setTo(0.5,0.5);
  	  	this.lasersBoss.children[i].checkWorldBounds = true;
  	  	this.lasersBoss.children[i].outOfBoundsKill = true;
    }
    this.lasersBoss.enableBody = true;
    this.game.physics.arcade.enable(this.lasersBoss);


  // Keys
	this.spacebar = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
  this.wasd = {
  	up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
  	down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
  	left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
  	right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
  };
  cursors = this.game.input.keyboard.createCursorKeys();
},

level3.update = function () {

	if(!this.finish){
		// Overlap
		this.game.physics.arcade.overlap(this.player, this.enemies, this.playerDie,
			null, this);
		this.game.physics.arcade.overlap(this.player, this.meteors, this.playerDie,
			null, this);
		this.game.physics.arcade.overlap(this.weapon.bullets, this.meteors, this.touchMeteor,
			null, this);
		this.game.physics.arcade.overlap(this.weapon.bullets, this.enemies, this.enemyDie,
			null, this);


		// Overlap Boss
		if(this.shield == null){
			this.game.physics.arcade.overlap(this.player, this.boss, this.playerDie,
				null, this);
		}
		this.game.physics.arcade.overlap(this.lasersBoss, this.meteors, this.touchMeteor,
			null, this);
		this.game.physics.arcade.overlap(this.player, this.lasersBoss, this.playerDie,
			null, this);
		this.game.physics.arcade.overlap(this.weapon.bullets, this.boss, this.damageBoss,
			null, this);


		// Bonus collectables
		if(this.star!=null){
			this.game.physics.arcade.overlap(this.player, this.star, this.takeBonus,
			null, this);
		}
		if(this.multiammo!=null){
			this.game.physics.arcade.overlap(this.player, this.multiammo, this.takeBonus,
			null, this);
		}
		if(this.homingMissile!=null){
			this.game.physics.arcade.overlap(this.player, this.homingMissile, this.takeBonus,
			null, this);
		}
		if(this.friendBonus!=null){
			this.game.physics.arcade.overlap(this.player, this.friendBonus, this.takeBonus,
			null, this);
		}

		if(this.friend.follow){
			this.game.physics.arcade.overlap(this.weaponFriend.bullets, this.enemies, this.enemyDie,
			null, this);
			this.game.physics.arcade.moveToXY(this.friend, this.player.x - 60, this.player.y + 10, 100, 500);
			this.weaponFriend.fire();
		}
		else{
			this.game.physics.arcade.moveToXY(this.friend, -100, this.game.world.centerY, 100, 500);
		}
	}

	if(!this.practiceMode){
		// Meteors spawn
		if (this.nextMeteor < this.game.time.now) {
			var delay = this.delayMeteor;
			this.addMeteor();
			this.nextMeteor = this.game.time.now + delay;
		}

		// Ennemies spawn
		if (this.nextEnemy < this.game.time.now) {
			var delay = this.delayEnemy;
			this.addEnemy();
			this.nextEnemy = this.game.time.now + delay;
		}	
	}

	// Boss mouvement
	if(this.boss.y > 200){
		this.boss.y = 200;

		if(this.boss.x > 200 && this.boss.x < 600){
			this.boss.x += 1;
		}
		else{
			if(this.boss.x >= 600){
				this.boss.x -= 1;		
			}
		}
	}
	
	if(this.boss.alive){
		this.fireLaserBoss();
	}

	// Player movement
  if ( (cursors.up.isDown || this.wasd.up.isDown))
  {
		this.player.body.acceleration.y = -500;
  }
  else if ( (cursors.down.isDown || this.wasd.down.isDown))
  {
  	this.player.body.acceleration.y = 500;
  }

  else if (cursors.left.isDown || this.wasd.left.isDown)
  {
    this.player.body.acceleration.x = -500;
    this.player.body.acceleration.y = 0;
  }
  else if (cursors.right.isDown || this.wasd.right.isDown)
  {
    this.player.body.acceleration.x = 500;
    this.player.body.acceleration.y = 0;
  }
  else
  {
	this.player.body.acceleration.x = 0;
	this.player.body.acceleration.y = 0;
  }

	// Fire laser event
	if(this.player.alive){
		if (this.spacebar.isDown) {
			if(this.playerBonus == 'missile'){
				this.weapon.fireRate = 200;
				if(this.enemies.getFirstAlive() != null){
					this.weapon.fireAtSprite(this.enemies.getFirstAlive());
				}
				else{
					this.weapon.fire();
				}
			} 
			else if(this.playerBonus == 'multiammo'){
				this.weapon.fireRate = 0;
				if (this.nextShotPowerUpAt > this.time.now) return;

				this.nextShotPowerUpAt = this.time.now + 200;
				for ( var i = 0; i < 2; i++ ) {

					var left = new Phaser.Point(this.player.position.x - (10+i*6), this.player.position.y - 20);
					this.weapon.fireAngle = -95 - i*10;
					this.weapon.fire(left);
								
					var right = new Phaser.Point(this.player.position.x + (10+i*6), this.player.position.y - 20);
					this.weapon.fireAngle = -85 + i*10;
					this.weapon.fire(right);
				}
			}
			else{
				this.weapon.fireRate = 200;
				this.weapon.fireAngle = 270;
				this.weapon.fire();
			}
		}
	}

	// Bonus timer
	if(this.bonusTimer.visible){
		if(this.bonusTimerSize > 0){
			this.bonusTimerSize -= 0.00165;
			this.bonusTimer.scale.setTo(this.bonusTimerSize,1);	
		}
	}

	// Shield
	if(this.shield != null){
		this.game.physics.arcade.overlap(this.shield, this.enemies, this.enemyDie,
			null, this);
		this.game.physics.arcade.overlap(this.shield, this.meteors, this.hitMeteor,
			null, this);
		this.game.physics.arcade.overlap(this.shield, this.lasersBoss, this.hitMeteor,
			null, this);
		this.game.physics.arcade.moveToObject(this.shield, this.player, 50, 50);
	}
}, // End update()

level3.startMenu = function() {
	this.game.state.start('mainTitle');
},
level3.resetPlayer = function() {
	this.player.reset(this.game.width/2, this.game.world.centerY + 100);
},
level3.fireLaserBoss = function () {
	var laserBoss = this.lasersBoss.getFirstExists(false);
	if (laserBoss) {
		this.laserSound.play();
		laserBoss.reset(this.boss.x, this.boss.y + 20);

		angleLaser = this.game.rnd.pick([45, 75, 90, 105, 120, 140]);
		laserBoss.angle = angleLaser - 80;
		this.physics.arcade.velocityFromAngle(angleLaser, 300, laserBoss.body.velocity);
	}
},
level3.takeBonus = function(player, bonus) {
	this.playerBonus = bonus.key;
	if(bonus.key == 'star'){
		this.shield = this.game.add.sprite(this.player.x + 30, this.player.y - 30, 'shield');
		this.game.physics.arcade.enable(this.shield);
		this.shield.anchor.setTo(0.5, 0.5);
	}

	if(bonus.key == 'friend_bonus'){
		this.friend.follow = true;
	}

	this.bonusTimer.visible = true;
	this.bonusLabel.visible = true;
	bonus.kill();
	this.game.time.events.add(10000, this.stopBonus, this);
},
level3.addEnemy = function() {
	var enemy = this.enemies.getFirstDead();
	if (!enemy) {
		return;
	}
	enemy.anchor.setTo(0.5, 1);
	enemy.healthPoint = this.enemyLife;
	enemy.reset(this.game.rnd.pick([100, 200, 300, 400, 500, 600, 700]), 0);

	enemy.rotation = this.game.physics.arcade.angleBetween(enemy, this.player) - 1.5;
	this.game.physics.arcade.moveToObject(enemy, this.player, 200);
	enemy.checkWorldBounds = true;
	enemy.outOfBoundsKill = true;
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
		    	this.finishLabel.text = 'YOU LOSE';
		    	this.finish = true;
		    	this.game.add.tween(this.finishLabel).to( { alpha: 1 }, 2500, "Linear", true);
		    	this.game.time.slowMotion = 2.0;
		        this.game.time.events.add(3000, this.startMenu, this);
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

	if(sprite.key == 'laser' || sprite.key == 'laser_green'){
		sprite.kill();
	}

	enemy.healthPoint -= 10;

	if(enemy.healthPoint <= 0){
		enemy.kill();

		number = this.game.rnd.pick([1, 2, 3 , 4, 5]);
		if(this.playerBonus == '' && this.bonusDropped == false){
			this.bonusDropped = true;
			switch(number){
				case 5 :
					this.star = this.game.add.sprite(enemyX, enemyY, 'star');
					this.star.anchor.setTo(0.5, 0.5);
					this.star.scale.setTo(0.8, 0.8);
					this.game.physics.arcade.enable(this.star);
					break;
				case 4 :
					this.multiammo = this.game.add.sprite(enemyX, enemyY, 'multiammo');
					this.multiammo.anchor.setTo(0.5, 0.5);
					this.multiammo.scale.setTo(0.8, 0.8);
					this.game.physics.arcade.enable(this.multiammo);
					break;
				case 3 :
					this.friendBonus = this.game.add.sprite(enemyX, enemyY, 'friend_bonus');
					this.friendBonus.anchor.setTo(0.5, 0.5);
					this.friendBonus.scale.setTo(0.8, 0.8);
					this.game.physics.arcade.enable(this.friendBonus);
					break;
				/*case 2 :
					this.homingMissile = this.game.add.sprite(enemyX, enemyY, 'missile');
					this.homingMissile.anchor.setTo(0.5, 0.5);
					this.homingMissile.scale.setTo(0.8, 0.8);
					this.game.physics.arcade.enable(this.homingMissile);
					break;*/
				case 1 :
					//
					break;   
			}
		}

		this.increaseScore(10);

		this.emitter.x = enemy.x;
		this.emitter.y = enemy.y;
		this.emitter.start(true, 800, null, 15);
	}
},

// Meteors
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
level3.hitMeteor = function(shield, sprite) {
	sprite.kill();
},
level3.touchMeteor = function(laser, meteor) {
	laser.kill();
},

level3.stopBonus = function() {
	if(this.shield != null){
		this.shield.kill();
	}

	if(this.friend.follow){
		this.friend.follow = false;
	}

	this.bonusTimer.visible = false;
	this.bonusLabel.visible = false;
	this.bonusTimer.scale.setTo(1,1);
	this.bonusTimerSize = 1;
	this.playerBonus = '';
	this.bonusDropped = false;
},
level3.toggleInvincible = function() {
	this.player.invincible = !this.player.invincible;
	if(!this.player.invincible){
		this.player.alpha = 1;
	}
},
level3.increaseScore = function(score){
	this.game.global.score += score;
	this.scoreLabel.text = 'Score: ' + this.game.global.score;
},
level3.damageBoss = function(boss, laser) {
	laser.kill();

	this.boss.healthPoint -= 10;
	if(this.boss.healthPoint <= 0){
		boss.kill();
		this.finish = true;
		this.game.add.tween(this.finishLabel).to( { alpha: 1 }, 2500, "Linear", true);
		this.game.time.slowMotion = 2.0;
		this.game.time.events.add(3000, this.finishGame, this);
	}
},
level3.finishGame = function () {
	this.game.state.start('finish');
}

module.exports = level3;
