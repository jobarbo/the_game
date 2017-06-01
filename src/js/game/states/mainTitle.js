var mainTitle = {};

/*
WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function() { 
      this.game.time.events.add(Phaser.Timer.SECOND, this.createText, this); 
    },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Inconsolata']
    }

};*/

mainTitle.create = function () {

  //localStorage.setItem('ship1Unlock', false);
  //localStorage.setItem('ship2Unlock', false);
	
  this.delayMeteor = 5000;

  this.game.physics.startSystem(Phaser.Physics.P2JS);

  var background = this.game.add.sprite(this.game.world.centerX - 10, this.game.world.centerY, 'background');
  background.anchor.setTo(0.5, 0.5);
  background.scale.setTo(3.4, 3.4);

  // Add ship
  this.ship = this.game.add.sprite(0, this.game.world.centerY + 160, this.game.global.ship);
  this.ship.anchor.setTo(0.5, 0.5);
  this.ship.scale.setTo(1, 1);
  this.game.physics.arcade.enable(this.ship);
  this.ship.body.velocity.x = 150;
  this.ship.body.velocity.y = 50;
  this.ship.angle = 110;

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

  // Meteors
  this.meteors = this.game.add.group();
  this.meteors.createMultiple(3, 'meteor');
  for (i = 0; i <this.meteors.length ; i++) {
    this.meteors.children[i].scale.setTo(0.8,0.8);
  }
  this.meteors.enableBody = true;
  this.game.physics.arcade.enable(this.meteors);
  this.nextMeteor = 0;

  highscoreLabel.anchor.setTo(0.5, 0.5);

  this.introMusic = this.game.add.audio('intro');
  this.introMusic.volume = 0.7;
  this.introMusic.play();

  this.createText();

  this.muteButton = this.game.add.button(20, 20, 'mute', this.toggleSound,
  this);

  
  // Mute setting
  if (!localStorage.getItem('mute')) {
    localStorage.setItem('mute', false);
    this.muteButton.frame = 2;
  }
  else{
    if(localStorage.getItem('mute') == 'false'){
      this.muteButton.frame = 2;
      this.game.sound.mute = false;
    }
    else{
      this.muteButton.frame = 1;
      this.game.sound.mute = true;
    }
  }

},

mainTitle.update = function () {
  // Fire laser event
  for (var index in this.phaserKeys) {
  	var key = this.phaserKeys[index];
  	if (key.justDown) {
  		this.startGame();
  	}
  }

  // Meteors spawn
  if (this.nextMeteor < this.game.time.now) {
    this.addMeteor();
    this.nextMeteor = this.game.time.now + this.delayMeteor;
  }

  this.meteors.forEach((b) => {
    b.rotation += 0.01;
  }, this);

  this.game.world.wrap(this.ship, 0, true);

},

mainTitle.createText = function () {
  this.startLabel = this.game.add.text(this.game.world.centerX, 250, 'Play',
    { font: '40px Arial', fill: '#ffffff' });
  this.startLabel.anchor.setTo(0.5, 0.5);
  this.startLabel.inputEnabled = true;
  this.startLabel.events.onInputDown.add(this.startGame, this);
  this.startLabel.events.onInputOver.add(this.overText, this);
  this.startLabel.events.onInputOut.add(this.outText, this);

  this.chooseShipLabel = this.game.add.text(this.game.world.centerX, 320, 'Choose Ship',
    { font: '40px Arial', fill: '#ffffff' });
  this.chooseShipLabel.anchor.setTo(0.5, 0.5);
  this.chooseShipLabel.inputEnabled = true;
  this.chooseShipLabel.events.onInputDown.add(this.chooseShip, this);
  this.chooseShipLabel.events.onInputOver.add(this.overText, this);
  this.chooseShipLabel.events.onInputOut.add(this.outText, this);
},

mainTitle.startGame = function () {
  this.introMusic.stop();
	this.game.state.start('game');
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
  localStorage.setItem('mute', this.game.sound.mute);
  this.muteButton.frame = this.game.sound.mute ? 1 : 2;
},
// Meteors
mainTitle.addMeteor = function() {
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

module.exports = mainTitle;
