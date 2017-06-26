var choose = {};

choose.create = function () {

  this.background = this.game.add.tileSprite(this.game.world.centerX - 10, this.game.world.centerY, 800, 600, 'background');
  this.background.anchor.setTo(0.5, 0.5);
  this.background.scale.setTo(3.4, 3.4);

  this.pimpMusic = this.game.add.audio('pimp');
  this.pimpMusic.volume = 0.7;
  this.pimpMusic.play();

  this.chooseShipLabel = this.game.add.text(this.game.world.centerX, 180, 'Choisi ton vaisseau',
    { font: '60px inconsolata', fill: '#ffffff' });
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

  this.backLabel = this.game.add.text(150, 500, 'Retour',
    { font: '28px inconsolata', fill: '#ffffff' });
  this.backLabel.anchor.setTo(0.5, 0.5);
  this.backLabel.inputEnabled = true;
  this.backLabel.events.onInputDown.add(this.goBack, {game: this.game, pimpMusic: this.pimpMusic});
  this.backLabel.events.onInputOver.add(this.overText, this);
  this.backLabel.events.onInputOut.add(this.outText, this);
  
  this.muteButton = this.game.add.button(20, 20, 'mute', this.toggleSound,
  this);
  this.muteButton.frame = this.game.sound.mute ? 1 : 2;

  this.backspace = this.game.input.keyboard.addKey(Phaser.KeyCode.BACKSPACE);
  
},

choose.update = function () {
  this.background.tilePosition.y += 1;

  if(this.backspace.isDown){
    this.goBack();
  }
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
      text = 'Très simple, ben plate';
      break;
    case 'ship2': 
      text = 'Plus de vie, aucune excuse !';
      break;
    case 'ship3': 
      text = 'Besoin de vitesse ?';
      break;
  }

  this.statsLabel = this.game.add.text(sprite.x, sprite.y - 80, text,
    { font: '20px inconsolata', fill: '#ffffff' });
  this.statsLabel.anchor.setTo(0.5, 0.5);
},

choose.outShip = function (sprite) {
  sprite.scale.setTo(1.6, 1.6);
  this.statsLabel.destroy();
},

choose.displayText = function (sprite) {
  if(sprite.key == 'ship3'){
    this.unlockLabel = this.game.add.text(this.player3.x, this.player3.y - 50, 'Débloque au niveau 5',
      { font: '20px inconsolata', fill: '#ffffff' });
  }
  else{
    this.unlockLabel = this.game.add.text(this.player2.x, this.player2.y - 50, 'Débloque au niveau 3',
      { font: '20px inconsolata', fill: '#ffffff' });  
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

choose.goBack = function () {
  this.pimpMusic.stop();
  this.game.state.start('mainTitle');
},

choose.overText = function (sprite) {
  sprite.scale.setTo(1.2, 1.2);
},

choose.outText = function (sprite) {
  sprite.scale.setTo(1, 1);
},
module.exports = choose;
