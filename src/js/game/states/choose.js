var choose = {};

choose.create = function () {

  var background = this.game.add.sprite(this.game.world.centerX - 10, this.game.world.centerY, 'background');
  background.anchor.setTo(0.5, 0.5);
  background.scale.setTo(3.4, 3.4);

  this.pimpMusic = this.game.add.audio('pimp');
  this.pimpMusic.volume = 0.7;
  this.pimpMusic.play();

  this.chooseShipLabel = this.game.add.text(this.game.world.centerX, 180, 'Choose Ship',
    { font: '60px Arial', fill: '#ffffff' });
  this.chooseShipLabel.anchor.setTo(0.5, 0.5);


  // Add player
  this.player = this.game.add.sprite(this.game.world.centerX - 200, this.game.world.centerY + 50, 'ship1');
  this.player.anchor.setTo(0.5, 0.5);
  this.player.scale.setTo(1.6, 1.6);
  this.player.inputEnabled = true;
  this.player.events.onInputDown.add(this.selectShip, this);
  this.player.events.onInputOver.add(this.overShip, this);
  this.player.events.onInputOut.add(this.outShip, this);

  this.player2 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 50, 'ship2');
  this.player2.anchor.setTo(0.5, 0.5);
  this.player2.scale.setTo(1.6, 1.6);
  this.player2.inputEnabled = true;

  if (localStorage.getItem('ship1Unlock') == 'true') {
    this.player2.events.onInputDown.add(this.selectShip, this);
    this.player2.events.onInputOver.add(this.overShip, this);
    this.player2.events.onInputOut.add(this.outShip, this);  
  }
  else{
    this.player2.tint = '#000000';
    this.player2.events.onInputOver.add(this.displayText, this);
    this.player2.events.onInputOut.add(this.removeText, this);
  }
  

  this.player3 = this.game.add.sprite(this.game.world.centerX + 200, this.game.world.centerY + 50, 'ship3');
  this.player3.anchor.setTo(0.5, 0.5);
  this.player3.scale.setTo(1.6, 1.6);
  this.player3.inputEnabled = true;

  if (localStorage.getItem('ship2Unlock') == 'true') {
    this.player3.events.onInputDown.add(this.selectShip, this);
    this.player3.events.onInputOver.add(this.overShip, this);
    this.player3.events.onInputOut.add(this.outShip, this);
  }
  else{
    this.player3.tint = '#000000';
    this.player3.events.onInputOver.add(this.displayText, this);
    this.player3.events.onInputOut.add(this.removeText, this);
  }
  
  this.muteButton = this.game.add.button(20, 20, 'mute', this.toggleSound,
  this);
  this.muteButton.frame = this.game.sound.mute ? 1 : 2;
  
},

choose.update = function () {
  // Fire laser event
  for (var index in this.phaserKeys) {
	var key = this.phaserKeys[index];
	if (key.justDown) {
		this.startLevel1();
	}
  }
},

choose.goBack = function () {
  this.pimpMusic.stop();
	this.game.state.start('mainTitle');
},

choose.selectShip = function (sprite) {
  this.game.global.ship = sprite.key;
  this.goBack();
},

choose.overShip = function (sprite) {
  sprite.scale.setTo(1.9, 1.9);

  var text = '';
  switch(sprite.key){
    case 'ship1': 
      text = 'Basic stuff, very boring';
      break;
    case 'ship2': 
      text = 'More health, no more excuse';
      break;
    case 'ship3': 
      text = 'Need speed ? take this';
      break;
  }

  this.statsLabel = this.game.add.text(sprite.x, sprite.y - 80, text,
    { font: '20px Arial', fill: '#ffffff' });
  this.statsLabel.anchor.setTo(0.5, 0.5);
},

choose.outShip = function (sprite) {
  sprite.scale.setTo(1.6, 1.6);
  this.statsLabel.destroy();
},

choose.displayText = function (sprite) {
  if(sprite.key == 'ship3'){
    this.unlockLabel = this.game.add.text(this.player3.x, this.player3.y - 50, 'Unlock at level 5',
      { font: '20px Arial', fill: '#ffffff' });
  }
  else{
    this.unlockLabel = this.game.add.text(this.player2.x, this.player2.y - 50, 'Unlock at level 3',
      { font: '20px Arial', fill: '#ffffff' });  
  }
  
  this.unlockLabel.anchor.setTo(0.5, 0.5);
},

choose.removeText = function (sprite) {
  this.unlockLabel.destroy();
},

choose.toggleSound = function() {
  this.game.sound.mute = !this.game.sound.mute;
  this.muteButton.frame = this.game.sound.mute ? 1 : 2;
},
module.exports = choose;
