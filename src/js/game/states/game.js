var game = {};

game.create = function () {

  this.game.global.score = 0;
  this.game.time.slowMotion = 1.0;

  this.playerBonus = '';
  this.game.global.currentWeapon = 'laser_green';
  this.game.input.keyboard.onDownCallback = function(e) {
  	if(e.keyCode == 49){
  		this.game.global.currentWeapon = 'laser_green';
  	}
  	if(e.keyCode == 50){
  		this.game.global.currentWeapon = 'laser_blue';
  	} 
  }
  this.shield = null;
  this.bonusDropped = false;
  this.nextShotAt = 0;
  this.practiceMode = false;
  this.pointPerEnemy = 10;
  this.finish = false;
  this.deployBoss = false;
  this.deploySecondEnemy = false;

  if(this.game.global.ship == 'ship3'){
  	this.speedPlayer = 800;
  }
  else{
  	this.speedPlayer = 500;
  }

  if(this.game.global.level % 3 == 0){
  	this.deployBoss = true;
  }

  if(this.game.global.level >= 2){
  	this.deploySecondEnemy = true;
  }
  
  if(this.game.global.level == 1 && this.game.global.ship == 'ship2'){
  	this.game.global.life = 4;
  }

  this.pointToNextLevel = 100;
  this.maxEnemyLife = 20;
  if(this.game.global.level % 3 != 0){
  	this.maxEnemyLife = 10 + (this.game.global.level * 10);
  }
  this.delayMeteor = 4000 - (this.game.global.level * 100);
  this.delayEnemy = 2500 - (this.game.global.level * 100);
  this.delaySecondEnemy = 5000 - (this.game.global.level * 100);

  this.maxBossLife = 500;
  if(this.game.global.level < 15){
  	this.maxBossLife = 500 + (this.game.global.level * 20);
  }
  this.bossDirection = 'left';

  // Background
  this.background = this.game.add.tileSprite(this.game.world.centerX - 10, this.game.world.centerY, 800, 600, 'background');
  this.background.anchor.setTo(0.5, 0.5);
  this.background.scale.setTo(3.4, 3.4);

  // Meteors
  this.meteors = this.game.add.group();
  this.meteors.createMultiple(10, 'meteor');
  for (i = 0; i <this.meteors.length ; i++) {
  	this.meteors.children[i].scale.setTo(0.8,0.8);
  }
  this.meteors.enableBody = true;
  this.game.physics.arcade.enable(this.meteors);
  this.nextMeteor = 0;
  

  // Add player
  this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 100, this.game.global.ship);
  this.player.anchor.setTo(0.5, 0.5);
  this.player.scale.setTo(0.5,0.5);
  this.game.physics.arcade.enable(this.player);
  this.player.body.drag.set(800);
  this.player.body.maxVelocity.set(this.speedPlayer);
  this.player.invincible = false;
  this.player.body.collideWorldBounds = true;

  this.player.alpha = 0.1;
  this.toggleInvincible();
  this.game.time.events.add(2500, this.toggleInvincible, this);

  // Add Friend
  this.friend = this.game.add.sprite(-100, this.game.world.centerY + 100, 'friend');
  this.friend.anchor.setTo(0.5, 0.5);
  this.friend.scale.setTo(0.3,0.3);
  this.game.physics.arcade.enable(this.friend);
  this.friend.follow = false;

  // Emitter
  this.emitter = this.game.add.emitter(0, 0, 100);
  this.emitter.makeParticles('pixel');
  this.emitter.setYSpeed(-150, 150);
  this.emitter.setXSpeed(-150, 150);
  this.emitter.setScale(2, 0, 2, 0, 800);
  this.emitter.gravity = 0;

  this.bonuses = this.game.add.group();
  this.bonuses.enableBody = true;
  this.game.physics.arcade.enable(this.bonuses);

  // Enemy lifebar
  var bmdEnemy = this.game.add.bitmapData(80, 8);
  bmdEnemy.ctx.beginPath();
  bmdEnemy.ctx.rect(0, 0, 80, 8);
  bmdEnemy.ctx.fillStyle = '#c0392b';
  bmdEnemy.ctx.fill();

  // Ennemies
  this.enemies = this.game.add.group();
  this.enemies.createMultiple(10, 'enemy');
  for (i = 0; i <this.enemies.length ; i++) {
	  this.enemies.children[i].scale.setTo(0.5,0.5);

	  // add lifebar to enemy
	  enemyLifeBar = this.game.add.sprite(this.enemies.children[i].x, this.enemies.children[i].y - 110, bmdEnemy);
	  enemyLifeBar.anchor.setTo(0.5, 0.5);
	  this.enemies.children[i].addChild(enemyLifeBar);
  }
  this.enemies.enableBody = true;
  this.game.physics.arcade.enable(this.enemies);
  this.nextEnemy = 0;

    // Ennemies shooter
    if(this.deploySecondEnemy){
	  this.secondEnemies = this.game.add.group();
	  this.secondEnemies.createMultiple(10, 'second_enemy');
	  for (i = 0; i <this.secondEnemies.length ; i++) {
		  this.secondEnemies.children[i].scale.setTo(0.8,0.8);

		  // add lifebar to enemy
		  secondEnemyLifeBar = this.game.add.sprite(this.secondEnemies.children[i].x, this.secondEnemies.children[i].y - 110, bmdEnemy);
		  secondEnemyLifeBar.anchor.setTo(0.5, 0.5);
		  this.secondEnemies.children[i].addChild(secondEnemyLifeBar);
	  }
	  this.secondEnemies.enableBody = true;
	  this.game.physics.arcade.enable(this.secondEnemies);
	  this.nextSecondEnemy = 0;	

	    // Lasers
	    this.weaponEnemy = this.game.add.weapon(30, 'laser');
	    this.weaponEnemy.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	    this.weaponEnemy.bulletSpeed = 400;
	    this.weaponEnemy.fireRate = 800;
	    this.weaponEnemy.fireAngle = 90;
	    this.game.physics.arcade.enable(this.weaponEnemy);
	    this.weaponEnemy.bullets.forEach((b) => {
	    	b.scale.setTo(0.5, 0.5);
	  	b.body.updateBounds();
	    }, this);
	    this.weaponEnemy.bulletAngleOffset = 90;
    }
    

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

    this.weaponBlue = this.game.add.weapon(30, 'laser_blue');
    this.weaponBlue.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.weaponBlue.bulletSpeed = 1000;
    this.weaponBlue.fireRate = 2000;
    this.weaponBlue.fireAngle = 270;
    this.game.physics.arcade.enable(this.weaponBlue);
    this.weaponBlue.trackSprite(this.player, 0, -230, false);
    this.weaponBlue.bullets.forEach((b) => {
    	b.scale.setTo(3, 8);
  	b.body.updateBounds();
    }, this);
    this.weaponBlue.bulletAngleOffset = 90;

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

  // Add Boss
  if(this.deployBoss){
  	this.boss = this.game.add.sprite(this.game.width/2, -100, 'boss');
  	this.boss.anchor.setTo(0.5, 0.5);
  	this.boss.scale.setTo(2,2);
  	this.game.physics.arcade.enable(this.boss);
  	this.boss.body.velocity.y = 50;
  	this.boss.healthPoint = this.maxBossLife;

  	// Boss lifebar
  	var bmdBoss = this.game.add.bitmapData(200, 8);
  	bmdBoss.ctx.beginPath();
  	bmdBoss.ctx.rect(0, 0, 200, 8);
  	bmdBoss.ctx.fillStyle = '#c0392b';
  	bmdBoss.ctx.fill();
  	this.bossLifeBar = this.game.add.sprite(this.boss.x, this.boss.y, bmdBoss);
  	this.bossLifeBar.anchor.setTo(0.5, 0.5);

  	//  Big explosion for boss
  	this.bossDeath = this.game.add.emitter(this.boss.x, this.boss.y);
  	this.bossDeath.width = this.boss.width / 2;
  	this.bossDeath.height = this.boss.height / 2;
  	this.bossDeath.makeParticles('explosion', [0,1,2,3,4,5,6,7], 20);
  	this.bossDeath.setAlpha(0.9, 0, 900);
  	this.bossDeath.setScale(0.3, 1.0, 0.3, 1.0, 1000, Phaser.Easing.Quintic.Out);


  	this.weaponBoss = this.game.add.weapon(10, 'laser');
  	this.weaponBoss.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
  	this.weaponBoss.bulletSpeed = 400;
  	this.weaponBoss.fireRate = 800;
  	this.weaponBoss.fireAngle = 90;
  	this.weaponBoss.bulletAngleVariance  = 40;
  	this.game.physics.arcade.enable(this.weaponBoss);
  	this.weaponBoss.trackSprite(this.boss, 0, 0, false);
  	this.weaponBoss.bullets.forEach((b) => {
  	  b.scale.setTo(0.5, 0.5);
  	  b.body.updateBounds();
  	}, this);
  	this.weaponBoss.bulletAngleOffset = 90;
  }

    //  An explosion pool
  this.explosions = this.game.add.group();
  this.explosions.enableBody = true;
  this.explosions.physicsBodyType = Phaser.Physics.ARCADE;
  this.explosions.createMultiple(30, 'explosion');
  this.explosions.setAll('anchor.x', 0.5);
  this.explosions.setAll('anchor.y', 0.5);
  this.explosions.forEach( function(explosion) {
      explosion.animations.add('explosion');
  });


  // Life
  this.lives = this.game.add.group();
  this.lives.createMultiple(this.game.global.life, this.game.global.ship + '_life');
  for (i = 0; i < this.game.global.life ; i++) {
  	this.lives.children[i].x = this.game.width - (220 - (i * 40));
  	this.lives.children[i].y = 20;
  	this.lives.children[i].visible = true;
  }

  // Bonus timer
  var bmd = this.game.add.bitmapData(100, 8);
  bmd.ctx.beginPath();
  bmd.ctx.rect(0, 0, 100, 8);
  bmd.ctx.fillStyle = '#ffffff';
  bmd.ctx.fill();
  this.bonusTimer = this.game.add.sprite(228, this.game.world.height + 50, bmd);
  this.bonusTimer.anchor.setTo(0.5, 0.5);

  // Labels
  this.scoreLabel = this.game.add.text(50, 20, 'Score: 0/' + this.pointToNextLevel,
  	{ font: '22px inconsolata', fill: '#ffffff' });
  this.levelLabel = this.game.add.text(this.game.world.centerX - 30, 20, 'Niveau ' + this.game.global.level,
  	{ font: '22px inconsolata', fill: '#ffffff' });
  this.bonusLabel = this.game.add.text(40, this.game.world.height + 50, 'Temps bonus: ',
  	{ font: '22px inconsolata', fill: '#ffffff' });

  this.finishLabel = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'TERMINÉ',
  	{ font: '40px inconsolata', fill: '#ffffff' });
  this.finishLabel.anchor.setTo(0.5,0.5);
  this.finishLabel.alpha = 0;

  // Sounds
  this.coinSound = this.game.add.audio('coin');
  this.laserSound = this.game.add.audio('laser');

  this.backgroundMusic = this.game.add.audio('level1');
  this.backgroundMusic.volume = 0.7;
  this.backgroundMusic.play();

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

game.update = function () {

	this.background.tilePosition.y += 1;

	if(!this.finish){
		// Overlap
		this.game.physics.arcade.overlap(this.player, this.enemies, this.playerDie,
			null, this);

		if(this.shield == null){
			this.game.physics.arcade.overlap(this.player, this.meteors, this.playerDie,
				null, this);

			if(this.deployBoss){
				this.game.physics.arcade.overlap(this.player, this.boss, this.playerDie,
				  null, this);
		 	}
		}

		// Boss overlap
		if(this.deployBoss){
			this.game.physics.arcade.overlap(this.weaponBoss.bullets, this.meteors, this.touchMeteor,
			  null, this);
			this.game.physics.arcade.overlap(this.player, this.weaponBoss.bullets, this.playerDie,
			  null, this);
			this.game.physics.arcade.overlap(this.weapon.bullets, this.boss, this.damageBoss,
			  null, this);

			this.game.physics.arcade.overlap(this.weaponBlue.bullets, this.boss, this.damageBoss,
			  null, this);
		}

		if(this.deploySecondEnemy){
			this.game.physics.arcade.overlap(this.player, this.weaponEnemy.bullets, this.playerDie,
				null, this);
			this.game.physics.arcade.overlap(this.player, this.secondEnemies, this.playerDie,
				null, this);
			this.game.physics.arcade.overlap(this.weapon.bullets, this.secondEnemies, this.damageEnemy,
				null, this);

			this.game.physics.arcade.overlap(this.weaponBlue.bullets, this.secondEnemies, this.damageEnemy,
			  null, this);
		}
		
		this.game.physics.arcade.overlap(this.weapon.bullets, this.meteors, this.touchMeteor,
			null, this);
		this.game.physics.arcade.overlap(this.weaponBlue.bullets, this.meteors, this.touchMeteor,
			null, this);
		this.game.physics.arcade.overlap(this.weapon.bullets, this.enemies, this.damageEnemy,
			null, this);
		this.game.physics.arcade.overlap(this.weaponBlue.bullets, this.enemies, this.damageEnemy,
			null, this);


		// Bonus collectables
		this.game.physics.arcade.overlap(this.player, this.bonuses, this.takeBonus,
			null, this);

		if(this.friend.follow){
			if(this.deployBoss){
				this.game.physics.arcade.overlap(this.weaponFriend.bullets, this.boss, this.damageBoss,
				null, this);
			}
			this.game.physics.arcade.overlap(this.weaponFriend.bullets, this.enemies, this.damageEnemy,
			null, this);
			if(this.deploySecondEnemy){
				this.game.physics.arcade.overlap(this.weaponFriend.bullets, this.secondEnemies, this.damageEnemy,
				null, this);
			}
			this.game.physics.arcade.overlap(this.weaponFriend.bullets, this.meteors, this.touchMeteor,
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
			this.addMeteor();
			this.nextMeteor = this.game.time.now + this.delayMeteor;
		}

		// Ennemies spawn
		if (this.nextEnemy < this.game.time.now) {
			this.addEnemy();
			this.nextEnemy = this.game.time.now + this.delayEnemy;
		}	

		// Second Ennemies spawn
		if(this.deploySecondEnemy){
			if (this.nextSecondEnemy < this.game.time.now) {
				this.addSecondEnemy();
				this.nextSecondEnemy = this.game.time.now + this.delaySecondEnemy;
			}
		}
		
	}
	
	// Player movement
  if ( (cursors.up.isDown || this.wasd.up.isDown))
  {
		this.player.body.acceleration.y = -this.speedPlayer;
  }
  else if ( (cursors.down.isDown || this.wasd.down.isDown))
  {
  	this.player.body.acceleration.y = this.speedPlayer;
  }

  else if (cursors.left.isDown || this.wasd.left.isDown)
  {
    this.player.body.acceleration.x = -this.speedPlayer;
    this.player.body.acceleration.y = 0;
  }
  else if (cursors.right.isDown || this.wasd.right.isDown)
  {
    this.player.body.acceleration.x = this.speedPlayer;
    this.player.body.acceleration.y = 0;
  }
  else
  {
	this.player.body.acceleration.x = 0;
	this.player.body.acceleration.y = 0;
  }

  // Boss mouvement
  if(this.deployBoss){

	if(this.boss.y > 200){
		this.boss.y = 200;

		if(this.bossDirection == 'left'){
		  this.boss.body.velocity.x = -60;
		  if(this.boss.x < 200){
		    this.bossDirection = 'right';
		  }
		}
		else{
		  this.boss.body.velocity.x = 60;
		  if(this.boss.x > 700){
		    this.bossDirection = 'left';
		  }
		}
	}
  	if(this.boss.alive){
  	  this.weaponBoss.fire();
  	}
  }

	// Fire laser event
	if(this.player.alive){
		if (this.spacebar.isDown) {
			if(this.playerBonus == 'missile'){
				this.weapon.fireRate = 200;
				if(this.deploySecondEnemy && this.secondEnemies.getFirstAlive() != null){
					this.weapon.fireAtSprite(this.secondEnemies.getFirstAlive());
				}
				else if(this.enemies.getFirstAlive() != null){
					this.weapon.fireAtSprite(this.enemies.getFirstAlive());
				}
				else{
					this.weapon.fire();
				}
			} 
			else if(this.playerBonus == 'multiammo'){
				this.weapon.fireRate = 0;
				if (this.nextShotAt > this.time.now) return;

				this.nextShotAt = this.time.now + 200;
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
				if(this.game.global.currentWeapon == 'laser_green'){
					this.weapon.fireRate = 200;
					this.weapon.fireAngle = 270;
					this.weapon.fire();
				}
				else{
					this.weaponBlue.fire();
				}
			}
		}
	}

	if(this.deploySecondEnemy){
		this.secondEnemies.forEach((enemy) => {
			if(enemy.alive){
				//this.weaponEnemy.fireAngle = enemy.angle + 90;
				this.weaponEnemy.trackSprite(enemy, 0, 0, true);
				this.weaponEnemy.fireAtSprite(this.player);
				//this.weaponEnemy.fire(enemy);
			}
		}, this);	
	}

	// Shield
	if(this.shield != null){

		if(this.deployBoss){
			this.game.physics.arcade.overlap(this.shield, this.weaponBoss.bullets, this.destroyBullet,
			  null, this);	
		}

		if(this.deploySecondEnemy){
			this.game.physics.arcade.overlap(this.shield, this.weaponEnemy.bullets, this.destroyBullet,
			  null, this);	
		}
		
		this.game.physics.arcade.overlap(this.shield, this.enemies, this.damageEnemy,
			null, this);
		if(this.deploySecondEnemy){
			this.game.physics.arcade.overlap(this.shield, this.secondEnemies, this.damageEnemy,
						null, this);
		}
		this.game.physics.arcade.moveToObject(this.shield, this.player, 50, 50);
	}

	if(this.deployBoss){
		this.bossLifeBar.x = this.boss.x;
		this.bossLifeBar.y = this.boss.y - 100;	
	}

	  this.meteors.forEach((b) => {
	  	b.rotation += 0.01;
	  }, this);


}, // End update()

game.startMenu = function() {
	this.backgroundMusic.stop();
	this.game.state.start('mainTitle');
},
game.startNextLevel = function () {
	this.backgroundMusic.stop();
	this.game.global.level++;
	this.game.state.start('game');
},
game.resetPlayer = function() {
	this.player.reset(this.game.width/2, this.game.world.centerY + 100);
},
game.takeBonus = function(player, bonus) {
	this.coinSound.play();
	this.playerBonus = bonus.key;
	if(bonus.key == 'shield_bonus'){
		this.shield = this.game.add.sprite(this.player.x + 30, this.player.y - 30, 'shield');
		this.game.physics.arcade.enable(this.shield);
		this.shield.anchor.setTo(0.5, 0.5);
	}

	if(bonus.key == 'friend_bonus'){
		this.friend.follow = true;
	}

	if(bonus.key == 'pill'){
		bonusHeart = this.game.add.sprite( (this.lives.children[this.lives.length - 1].x + 40 ), 20, this.game.global.ship + '_life');
		this.lives.add(bonusHeart);
		this.game.global.life += 1;
		this.stopBonus();
	}
	else{
		this.add.tween(this.bonusTimer.scale).to({ x: 0, y: 1} , 10000, "Linear", true);
		this.game.add.tween(this.bonusLabel).to( { y: 530 }, 1000, "Linear", true);
		this.game.add.tween(this.bonusTimer).to( { y: 543 }, 1000, "Linear", true);

		this.game.time.events.add(10000, this.stopBonus, this);
	}

	bonus.kill();
	this.bonusDropped == false;
},
game.addEnemy = function() {
	var enemy = this.enemies.getFirstDead();
	if (!enemy) {
		return;
	}
	enemy.anchor.setTo(0.5, 1);
	enemy.healthPoint = this.maxEnemyLife;
	enemy.reset(this.game.rnd.pick([100, 200, 300, 400, 500, 600, 700]), 0);

	enemy.children[0].scale.setTo(1, 1);

	enemy.rotation = this.game.physics.arcade.angleBetween(enemy, this.player) - 1.5;
	this.game.physics.arcade.moveToObject(enemy, this.player, 200);
	enemy.checkWorldBounds = true;
	enemy.outOfBoundsKill = true;
},
game.addSecondEnemy = function() {
	var enemy = this.secondEnemies.getFirstDead();
	if (!enemy) {
		return;
	}
	enemy.anchor.setTo(0.5, 1);
	enemy.healthPoint = this.maxEnemyLife;
	enemy.reset(this.game.rnd.pick([300, 400, 500, 600]), 0);

	enemy.children[0].scale.setTo(1, 1);

	enemy.rotation = this.game.physics.arcade.angleBetween(enemy, this.player) - 1.5;
	this.game.physics.arcade.moveToObject(enemy, this.player, 200);
	enemy.checkWorldBounds = true;
	enemy.outOfBoundsKill = true;
},
game.playerDie = function() {

	if(!this.player.invincible){

		this.emitter.forEach (function(particle){ 
			particle.key = 'pixel';
			particle.loadTexture('pixel', 0);
		}, this);

		this.emitter.x = this.player.x;
		this.emitter.setScale(2, 0, 2, 0, 800);
		this.emitter.y = this.player.y;
		this.emitter.start(true, 800, null, 15);

		this.player.kill();
		this.game.global.life -= 1;
		this.lives.remove(this.lives.children[this.game.global.life]);

		if(this.game.global.life > 0){
			this.game.time.events.add(1000, this.resetPlayer, this);
		}
		else{
			this.finishLabel.text = 'VOUS AVEZ PERDU';
			this.finish = true;
			this.game.add.tween(this.finishLabel).to( { alpha: 1 }, 2500, "Linear", true);
			this.game.time.slowMotion = 2.0;
		    this.game.time.events.add(3000, this.startMenu, this);
		    this.game.global.life = 3;
		    this.game.global.level = 1;
		}

		this.stopBonus();
		this.player.alpha = 0.1;
		this.toggleInvincible();
		this.game.time.events.add(2500, this.toggleInvincible, this);
	}
},
game.damageEnemy = function(sprite, enemy) {
	enemyX = enemy.x;
	enemyY = enemy.y;

	this.emitter.forEach (function(particle){ 
		particle.key = 'pixel';
		particle.loadTexture('pixel', 0);
	}, this);

	if(sprite.key == 'laser' || sprite.key == 'laser_green'){
		sprite.kill();
	}

	enemy.healthPoint -= 10;

	enemy.tint = '0xff5c5c';
    this.game.time.events.add(100, this.resetTint, this, enemy);

	enemy.children[0].scale.setTo( (enemy.healthPoint / this.maxEnemyLife ) , 1);	

	if(enemy.healthPoint <= 0){

		var pointForKill = this.pointPerEnemy;
		if(enemy.key == 'second_enemy'){
			pointForKill = pointForKill *2;
		}

		// Points label
		this.pointsLabel = this.game.add.text(enemyX, enemyY - 5, '+' + pointForKill + 'pts',
			{ font: '16px inconsolata', fill: '#ffffff' });
		this.pointsLabel.alpha = 0;
		this.game.add.tween(this.pointsLabel).to( { alpha: 1 }, 1200, "Linear", true);
		this.game.add.tween(this.pointsLabel).to( { y: (enemyY - 30) }, 1000, "Linear", true);
		this.game.time.events.add(1200, this.removeTextPoint, this, this.pointsLabel);
 	   
		if(this.playerBonus == '' && this.bonusDropped == false){
			this.dropBonus(enemyX, enemyY);
		}

		this.increaseScore(pointForKill);

	  var explosion = this.explosions.getFirstExists(false);
	  var beforeScaleX = this.explosions.scale.x;
	  var beforeScaleY = this.explosions.scale.y;
	  var beforeAlpha = this.explosions.alpha;
	  explosion.reset(enemy.body.x + enemy.body.halfWidth, enemy.body.y + enemy.body.halfHeight);
	  explosion.alpha = 0.4;
	  explosion.scale.x = 1;
	  explosion.scale.y = 1;
	  var animation = explosion.play('explosion', 30, false, true);
	  animation.onComplete.addOnce(function(){
	      explosion.scale.x = beforeScaleX;
	      explosion.scale.y = beforeScaleY;
	      explosion.alpha = beforeAlpha;
	  });

	  enemy.kill();

		/*this.emitter.x = enemyX;
		this.emitter.y = enemyY;
		this.emitter.setScale(2, 0, 2, 0, 800);
		this.emitter.start(true, 800, null, 15);*/
	}
},
game.resetTint = function(sprite){
	sprite.tint = '0xffffff';
},

// Meteors
game.addMeteor = function() {
	var meteor = this.meteors.getFirstDead();
	if (!meteor) {
		return;
	}
	var key = this.game.rnd.pick(['meteor_grey_med', 'meteor_grey', 'meteor_med', 'meteor']);
	var angle = this.game.rnd.pick([0,20,40,60,80,100]);
	meteor.key = key;
	meteor.loadTexture(key, 0);
	meteor.anchor.setTo(0.5, 0.5);
	meteor.angle = angle;
	if(key == 'meteor_grey_med' || key == 'meteor_med'){
		meteor.healthPoint = 2;
	}
	else{
		meteor.healthPoint = 3;
	}

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
game.touchMeteor = function(laser, meteor) {
	if(laser.key != 'laser_blue'){
		laser.kill();
	}
	else{
		meteor.healthPoint = 0;
	}

	if(meteor.key == 'meteor_grey' || meteor.key == 'meteor_grey_med'){

		this.emitter.forEach (function(particle){ 
			particle.key = 'pixel_grey';
			particle.loadTexture('pixel_grey', 0);
		}, this);
	}
	else{
		this.emitter.forEach (function(particle){ 
			particle.key = 'pixel_brown';
			particle.loadTexture('pixel_brown', 0);
		}, this);
	}

	this.emitter.x = meteor.x;
	this.emitter.setScale(1, 0, 1, 0, 800);
	this.emitter.y = meteor.y;
	this.emitter.start(true, 800, null, 15);

	meteor.healthPoint -= 1;
	if(meteor.healthPoint <= 0){
		if(this.playerBonus == ''  && this.bonusDropped == false){
			this.dropBonus(meteor.x, meteor.y);
		}
		meteor.kill();
	}
},

game.stopBonus = function() {
	if(this.shield != null){
		this.shield.kill();
	}

	if(this.friend.follow){
		this.friend.follow = false;
	}

	this.game.add.tween(this.bonusLabel).to( { y: this.game.world.height+50 }, 500, "Linear", true);
	this.game.add.tween(this.bonusTimer).to( { y: this.game.world.height+50 }, 500, "Linear", true);

	this.game.time.events.add(1000, this.resetTimer, this);
	this.playerBonus = '';
},
game.resetTimer = function() {
	this.bonusTimer.scale.setTo(1,1);
},
game.toggleInvincible = function() {
	this.player.invincible = !this.player.invincible;
	if(!this.player.invincible){
		this.player.alpha = 1;
	}
},
game.increaseScore = function(score){
	this.game.global.score += score;
	this.scoreLabel.text = 'Score: ' + this.game.global.score + '/' + this.pointToNextLevel;
	if(this.game.global.score >= this.pointToNextLevel && this.game.global.level % 3 != 0){
		this.finish = true;
		this.game.add.tween(this.finishLabel).to( { alpha: 1 }, 2500, "Linear", true);
		this.game.time.slowMotion = 2.0;
		this.game.time.events.add(4000, this.startNextLevel, this);
	}
},
game.removeTextPoint = function(text){
	text.destroy();
},
game.dropBonus = function(spriteX, spriteY){

	if(spriteX > 80 && spriteX < 720 && spriteY > 80 && spriteY < 520){
		number = this.game.rnd.pick([1, 2, 3 , 4, 5, 6, 7, 8, 9, 10]);
		bonusKey = '';
		switch(number){
			case 5 :
				bonusKey = 'shield_bonus';
				break;
			case 4 :
				bonusKey = 'multiammo';
				break;
			case 3 :
				bonusKey = 'friend_bonus';
				break;
			case 2 :
				if(this.game.global.level % 3 != 0){
					bonusKey = 'missile';
				}
				break;
			case 1 :
			case 6 :
			case 7 :
			case 8 :
				if(this.game.global.ship == 'ship2' && this.game.global.life < 5){
					bonusKey = 'pill';
				}
				else if(this.game.global.life < 4){
					bonusKey = 'pill';
				}
				
				break;
		}
		if(bonusKey != ''){
			this.bonusDropped = true;

			bonusSprite = this.game.add.sprite(spriteX, spriteY, bonusKey);
			bonusSprite.anchor.setTo(0.5, 0.5);
			bonusSprite.scale.setTo(0.8, 0.8);
		    this.bonuses.add(bonusSprite);

	    	var tween = this.game.add.tween(bonusSprite.scale).to( { x: 1.05, y: 1.05 }, 500, "Linear", true);
	        tween.repeat(15, 500);

		    this.game.time.events.add(6500, this.flashBonus, this, bonusSprite);
			this.game.time.events.add(10000, this.resetBonus, this, bonusSprite);
		}
	}
},
game.resetBonus = function(sprite){
	sprite.kill();
	this.bonusDropped = false;
},
game.flashBonus = function(sprite){
	var tween = game.add.tween(sprite).to( { alpha: 0 }, 200, "Linear", true);
    tween.repeat(10, 200);
},
game.damageBoss = function(boss, laser) {
  if(laser.key != 'laser_blue'){
  	laser.kill();
  	this.boss.healthPoint -= 10;
  }
  else{
  	this.boss.healthPoint -= 4;
  }

  this.bossLifeBar.scale.setTo( (this.boss.healthPoint / this.maxBossLife ) , 1); 

  // Not sure ..
  this.boss.tint = '0xff5c5c';
  this.game.time.events.add(200, this.resetTint, this, this.boss);

  if(this.boss.healthPoint <= 0){

  	var shipToUnlock = '';
  	if(localStorage.getItem('ship1Unlock') == 'true' && localStorage.getItem('ship2Unlock') != 'true'){
  		localStorage.setItem('ship2Unlock', true);
  		shipToUnlock = 'ship3';
	}
	else if (localStorage.getItem('ship1Unlock') != 'true'){
		localStorage.setItem('ship1Unlock', true);
		shipToUnlock = 'ship2';
	}
	if(shipToUnlock){
		this.newShipLabel = this.game.add.text(this.game.world.centerX + 20, this.game.world.centerY - 200, 'Nouveau vaisseau débloqué !',
			{ font: '30px inconsolata', fill: '#ffffff' });
		this.newShipLabel.anchor.setTo(0.5,0.5);
		this.newShipLabel.alpha = 0;

		this.newShip = this.game.add.sprite(this.game.world.centerX - 220, this.game.world.centerY - 202, shipToUnlock + '_life');
		this.newShip.anchor.setTo(0.5, 0.5);
		this.newShip.alpha = 0;

		this.game.add.tween(this.newShip).to( { alpha: 1 }, 2000, "Linear", true);
		this.game.add.tween(this.newShipLabel).to( { alpha: 1 }, 2000, "Linear", true);
		this.game.time.events.add(3000, this.fadeOutUnlock, this);
	}
    
    this.finish = true;

    this.bossDeath.x = boss.x;
    this.bossDeath.y = boss.y;
    this.bossDeath.start(false, 1000, 50, 20);

	  var explosion = this.explosions.getFirstExists(false);
	  var beforeScaleX = this.explosions.scale.x;
	  var beforeScaleY = this.explosions.scale.y;
	  var beforeAlpha = this.explosions.alpha;
	  explosion.reset(boss.body.x + boss.body.halfWidth, boss.body.y + boss.body.halfHeight);
	  explosion.alpha = 0.4;
	  explosion.scale.x = 3;
	  explosion.scale.y = 3;
	  var animation = explosion.play('explosion', 30, false, true);
	  animation.onComplete.addOnce(function(){
	      explosion.scale.x = beforeScaleX;
	      explosion.scale.y = beforeScaleY;
	      explosion.alpha = beforeAlpha;
	  });

	  boss.kill();

    this.game.add.tween(this.finishLabel).to( { alpha: 1 }, 2500, "Linear", true);
    this.game.time.slowMotion = 2.0;
    this.game.time.events.add(4000, this.startNextLevel, this);
  }
},
game.finishGame = function () {
  this.backgroundMusic.stop();
  this.game.state.start('finish');
},

game.destroyBullet = function (sprite, bullet) {
  bullet.kill();
},

game.fadeOutUnlock = function () {
	this.game.add.tween(this.newShip).to( { alpha: 0 }, 1000, "Linear", true);
	this.game.add.tween(this.newShipLabel).to( { alpha: 0 }, 1000, "Linear", true);
}

module.exports = game;
