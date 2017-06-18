var tuto = {};

tuto.create = function () {

  this.keyPressed = false;

  this.background = this.game.add.tileSprite(this.game.world.centerX - 10, this.game.world.centerY, 800, 600, 'background');
  this.background.anchor.setTo(0.5, 0.5);
  this.background.scale.setTo(3.4, 3.4);

  this.game.global.currentPage = 1;

  this.titleLabel = this.game.add.text(this.game.world.centerX, 130, 'Bonus',
    { font: '60px inconsolata', fill: '#ffffff' });
  this.titleLabel.anchor.setTo(0.5, 0.5);

  this.backLabel = this.game.add.text(150, 500, 'Retour',
    { font: '28px inconsolata', fill: '#ffffff' });
  this.backLabel.anchor.setTo(0.5, 0.5);
  this.backLabel.inputEnabled = true;
  this.backLabel.events.onInputDown.add(this.goBack, {game: this.game});
  this.backLabel.events.onInputOver.add(this.overText, this);
  this.backLabel.events.onInputOut.add(this.outText, this);

  this.arrBonusText = [
  'Le missile tête chercheuse fonce directement sur l\'ennemi le plus proche, easy peasy !', 
  'Multiplie vos lasers   \\ | /',
  'Un vaisseau combatant vous accompagne un court instant',
  'Le bouclier vous protège des lasers et des météorites',
  'Une pilule, une tite granule, une vie',
  'Laser de basse qualité, mais performant ! Appuyer sur [1] pour activer',
  'Un laser puissant qui fait le ménage ! Appuyer sur [2] pour activer'
  ];
  this.arrBonusKey = ['missile', 'multiammo', 'friend_bonus', 'shield_bonus', 'pill'];

  this.muteButton = this.game.add.button(20, 20, 'mute', this.toggleSound,
  this);
  this.muteButton.frame = this.game.sound.mute ? 1 : 2;


  this.bonus1 = this.game.add.sprite(260, 250, 'missile');
  this.bonus1.anchor.setTo(0.5, 0.5);
  this.bonus1.scale.setTo(1.5, 1.5);

  var tween = this.game.add.tween(this.bonus1.scale).to( { x: 1.05, y: 1.05 }, 500, "Linear", true);
      tween.repeat(15, 500);

  this.firstBonusLabel = this.game.add.text(480, 245, this.arrBonusText[0],
    { font: '16px inconsolata', fill: '#ffffff' });
  this.firstBonusLabel.wordWrap = true;
  this.firstBonusLabel.wordWrapWidth = 300;
  this.firstBonusLabel.anchor.setTo(0.5, 0.5);

  this.bonus2 = this.game.add.sprite(260, 350, 'multiammo');
  this.bonus2.anchor.setTo(0.5, 0.5);
  this.bonus2.scale.setTo(1.5, 1.5);

  var tween = this.game.add.tween(this.bonus2.scale).to( { x: 1.05, y: 1.05 }, 500, "Linear", true);
      tween.repeat(15, 500);

      this.weapon1 = this.game.add.sprite(260, 250, 'laser_green');
      this.weapon1.anchor.setTo(0.5, 0.5);
      this.weapon1.scale.setTo(1.5, 1.5);
      this.weapon1.visible = false;

      this.weapon2 = this.game.add.sprite(260, 350, 'laser_blue');
      this.weapon2.anchor.setTo(0.5, 0.5);
      this.weapon2.scale.setTo(2.5, 1.5);
      this.weapon2.visible = false;

  this.secondBonusLabel = this.game.add.text(460, 355, this.arrBonusText[1],
    { font: '16px inconsolata', fill: '#ffffff' });
  this.secondBonusLabel.wordWrap = true;
  this.secondBonusLabel.wordWrapWidth = 300;
  this.secondBonusLabel.anchor.setTo(0.5, 0.5);

  this.nextLabel = this.game.add.text(650, 500, 'Suivant',
    { font: '28px inconsolata', fill: '#ffffff' });
  this.nextLabel.anchor.setTo(0.5, 0.5);
  this.nextLabel.inputEnabled = true;
  this.nextLabel.events.onInputDown.add(this.goNext, {
      titleLabel: this.titleLabel, 
      bonus2: this.bonus2, 
      game: this.game, 
      bonus1: this.bonus1, 
      weapon2: this.weapon2, 
      weapon1: this.weapon1,
      currentPage: this.game.global.currentPage,
      arrBonusText: this.arrBonusText,
      secondBonusLabel: this.secondBonusLabel,
      firstBonusLabel: this.firstBonusLabel,
    });
  this.nextLabel.events.onInputOver.add(this.overText, this);
  this.nextLabel.events.onInputOut.add(this.outText, this);

  this.previousLabel = this.game.add.text(500, 500, 'Précédent',
    { font: '28px inconsolata', fill: '#ffffff' });
  this.previousLabel.anchor.setTo(0.5, 0.5);
  this.previousLabel.inputEnabled = true;
  this.previousLabel.events.onInputDown.add(this.goPrevious, {
      titleLabel: this.titleLabel, 
      bonus2: this.bonus2, 
      bonus1: this.bonus1, 
      game: this.game,
      weapon2: this.weapon2, 
      weapon1: this.weapon1,
      currentPage: this.game.global.currentPage,
      arrBonusText: this.arrBonusText,
      secondBonusLabel: this.secondBonusLabel,
      firstBonusLabel: this.firstBonusLabel,
    });
  this.previousLabel.events.onInputOver.add(this.overText, this);
  this.previousLabel.events.onInputOut.add(this.outText, this);

  cursors = this.game.input.keyboard.createCursorKeys();
  this.backspace = this.game.input.keyboard.addKey(Phaser.KeyCode.BACKSPACE);
  this.wasd = {
    up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
    down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
    left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
    right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
  };
  
},

tuto.update = function () {
  this.background.tilePosition.y += 1;

  if ( (cursors.left.isDown  || this.wasd.left.isDown) && (cursors.right.isUp && this.wasd.right.isUp) ){
      if (!this.keyPressed) {
          this.goPrevious();
          this.keyPressed = true;
      }
  }

  if ( (cursors.left.isUp  && this.wasd.left.isUp) && (cursors.right.isDown  || this.wasd.right.isDown) ){
      if (!this.keyPressed) {
          this.goNext();
          this.keyPressed = true;
      }
  }

  if(this.backspace.isDown){
    this.goBack();
  }

  if (cursors.left.isUp && cursors.right.isUp && this.wasd.left.isUp && this.wasd.right.isUp) {
      this.keyPressed = false;
  }
  
},

tuto.goBack = function () {
  //this.pimpMusic.stop();
	this.game.state.start('mainTitle');
},

tuto.toggleSound = function() {
  this.game.sound.mute = !this.game.sound.mute;
  this.muteButton.frame = this.game.sound.mute ? 1 : 2;
},

tuto.overText = function (sprite) {
  sprite.scale.setTo(1.2, 1.2);
},

tuto.outText = function (sprite) {
  sprite.scale.setTo(1, 1);
},

tuto.goNext = function () {

  if(this.game.global.currentPage < 4){
    this.game.global.currentPage += 1;
  }

  this.firstBonusLabel.x = 480;
  this.secondBonusLabel.x = 460;
  this.bonus2.visible = true;
  switch(this.game.global.currentPage){
    case 1:
      this.bonus1.key = 'missile';
      this.bonus1.loadTexture('missile', 0);
      this.bonus2.key = 'multiammo';
      this.bonus2.loadTexture('multiammo', 0);
      this.firstBonusLabel.text = this.arrBonusText[this.game.global.currentPage - 1];
      this.secondBonusLabel.text = this.arrBonusText[this.game.global.currentPage];
      break;
    case 2:
    this.firstBonusLabel.x = 460;
    this.bonus1.key = 'friend_bonus';
    this.bonus1.loadTexture('friend_bonus', 0);
    this.secondBonusLabel.x = 490;
    this.bonus2.key = 'shield_bonus';
    this.bonus2.loadTexture('shield_bonus', 0);
      this.firstBonusLabel.text = this.arrBonusText[this.game.global.currentPage];
      this.secondBonusLabel.text = this.arrBonusText[this.game.global.currentPage + 1];
      break;
    case 3:
      this.bonus1.key = 'pill';
      this.bonus1.loadTexture('pill', 0);
      this.firstBonusLabel.text = this.arrBonusText[this.game.global.currentPage  + 1];
      this.secondBonusLabel.text = ''; //this.arrBonusText[this.game.global.currentPage + 2];
      this.bonus2.visible = false;
      break;
    case 4:
      this.titleLabel.text = 'Améliorations';

      this.bonus1.visible = false;
      this.bonus2.visible = false;
      this.weapon1.visible = true;
      this.weapon2.visible = true;

      this.secondBonusLabel.x = 490;

      this.firstBonusLabel.text = this.arrBonusText[this.game.global.currentPage  + 1];
      this.secondBonusLabel.text = this.arrBonusText[this.game.global.currentPage + 2];
      break;
  }
},

tuto.goPrevious = function () {

  if(this.game.global.currentPage > 1){
    this.game.global.currentPage -= 1;
  }

  this.titleLabel.text = 'Bonus';
  this.bonus1.visible = true;
  this.bonus2.visible = true;
  this.weapon1.visible = false;
  this.weapon2.visible = false;
  this.firstBonusLabel.x = 480;
  this.secondBonusLabel.x = 460;

  switch(this.game.global.currentPage){
    case 1:
      this.bonus1.key = 'missile';
      this.bonus1.loadTexture('missile', 0);
      this.bonus2.key = 'multiammo';
      this.bonus2.loadTexture('multiammo', 0);
      this.firstBonusLabel.text = this.arrBonusText[this.game.global.currentPage - 1];
      this.secondBonusLabel.text = this.arrBonusText[this.game.global.currentPage];
      break;
    case 2:
      this.firstBonusLabel.x = 460;
      this.bonus1.key = 'friend_bonus';
      this.secondBonusLabel.x = 490;
      this.bonus1.loadTexture('friend_bonus', 0);
      this.bonus2.key = 'shield_bonus';
      this.bonus2.loadTexture('shield_bonus', 0);
      this.firstBonusLabel.text = this.arrBonusText[this.game.global.currentPage];
      this.secondBonusLabel.text = this.arrBonusText[this.game.global.currentPage + 1];
      break;
    case 3:
      this.bonus1.key = 'pill';
      this.bonus1.loadTexture('pill', 0);
      this.firstBonusLabel.text = this.arrBonusText[this.game.global.currentPage  + 1];
      this.secondBonusLabel.text = ''; //this.arrBonusText[this.game.global.currentPage + 2];
      this.bonus2.visible = false;
      break;
    case 4:
      this.titleLabel.text = 'Améliorations';

      this.bonus1.visible = false;
      this.bonus2.visible = false;
      this.weapon1.visible = true;
      this.weapon2.visible = true;
    
      this.firstBonusLabel.x = 470;
      this.secondBonusLabel.x = 500;
      this.firstBonusLabel.text = this.arrBonusText[this.game.global.currentPage  + 1];
      this.secondBonusLabel.text = this.arrBonusText[this.game.global.currentPage + 2];
      break;
  }
  
},

module.exports = tuto;
