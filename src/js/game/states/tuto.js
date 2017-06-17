var tuto = {};

tuto.create = function () {

  this.background = this.game.add.tileSprite(this.game.world.centerX - 10, this.game.world.centerY, 800, 600, 'background');
  this.background.anchor.setTo(0.5, 0.5);
  this.background.scale.setTo(3.4, 3.4);

  this.titleLabel = this.game.add.text(this.game.world.centerX, 130, 'Bonus',
    { font: '60px Arial', fill: '#ffffff' });
  this.titleLabel.anchor.setTo(0.5, 0.5);

  this.backLabel = this.game.add.text(150, 500, 'Retour',
    { font: '28px Arial', fill: '#ffffff' });
  this.backLabel.anchor.setTo(0.5, 0.5);
  this.backLabel.inputEnabled = true;
  this.backLabel.events.onInputDown.add(this.goBack, {game: this.game});
  this.backLabel.events.onInputOver.add(this.overText, this);
  this.backLabel.events.onInputOut.add(this.outText, this);


  this.muteButton = this.game.add.button(20, 20, 'mute', this.toggleSound,
  this);
  this.muteButton.frame = this.game.sound.mute ? 1 : 2;


  this.missile = this.game.add.sprite(260, 250, 'missile');
  this.missile.anchor.setTo(0.5, 0.5);
  this.missile.scale.setTo(1.5, 1.5);

  var tween = this.game.add.tween(this.missile.scale).to( { x: 1.05, y: 1.05 }, 500, "Linear", true);
      tween.repeat(15, 500);

    text = 'Le missile tête chercheuse fonce directement sur l\'ennemi le plus proche, easy peasy !';
  this.firstBonusLabel = this.game.add.text(500, 245, text,
    { font: '16px Arial', fill: '#ffffff' });
  this.firstBonusLabel.wordWrap = true;
  this.firstBonusLabel.wordWrapWidth = 300;
  this.firstBonusLabel.anchor.setTo(0.5, 0.5);

  this.multiammo = this.game.add.sprite(260, 350, 'multiammo');
  this.multiammo.anchor.setTo(0.5, 0.5);
  this.multiammo.scale.setTo(1.5, 1.5);

  var tween = this.game.add.tween(this.multiammo.scale).to( { x: 1.05, y: 1.05 }, 500, "Linear", true);
      tween.repeat(15, 500);

      this.weapon1 = this.game.add.sprite(260, 250, 'laser_green');
      this.weapon1.anchor.setTo(0.5, 0.5);
      this.weapon1.scale.setTo(1.5, 1.5);
      this.weapon1.visible = false;

      this.weapon2 = this.game.add.sprite(260, 350, 'laser_blue');
      this.weapon2.anchor.setTo(0.5, 0.5);
      this.weapon2.scale.setTo(2.5, 1.5);
      this.weapon2.visible = false;

    text = 'Multiplie vos lasers   \\ | /';
  this.secondBonusLabel = this.game.add.text(440, 355, text,
    { font: '16px Arial', fill: '#ffffff' });
  this.secondBonusLabel.wordWrap = true;
  this.secondBonusLabel.wordWrapWidth = 300;
  this.secondBonusLabel.anchor.setTo(0.5, 0.5);

  this.nextLabel = this.game.add.text(650, 500, 'Suivant',
    { font: '28px Arial', fill: '#ffffff' });
  this.nextLabel.anchor.setTo(0.5, 0.5);
  this.nextLabel.inputEnabled = true;
  this.nextLabel.events.onInputDown.add(this.goNext, {
      titleLabel: this.titleLabel, 
      multiammo: this.multiammo, 
      missile: this.missile, 
      weapon2: this.weapon2, 
      weapon1: this.weapon1,
      secondBonusLabel: this.secondBonusLabel,
      firstBonusLabel: this.firstBonusLabel,
    });
  this.nextLabel.events.onInputOver.add(this.overText, this);
  this.nextLabel.events.onInputOut.add(this.outText, this);

  this.previousLabel = this.game.add.text(500, 500, 'Précédent',
    { font: '28px Arial', fill: '#ffffff' });
  this.previousLabel.anchor.setTo(0.5, 0.5);
  this.previousLabel.inputEnabled = true;
  this.previousLabel.events.onInputDown.add(this.goPrevious, {
      titleLabel: this.titleLabel, 
      multiammo: this.multiammo, 
      missile: this.missile, 
      weapon2: this.weapon2, 
      weapon1: this.weapon1,
      secondBonusLabel: this.secondBonusLabel,
      firstBonusLabel: this.firstBonusLabel,
    });
  this.previousLabel.events.onInputOver.add(this.overText, this);
  this.previousLabel.events.onInputOut.add(this.outText, this);
  
},

tuto.update = function () {
  this.background.tilePosition.y += 1;
  
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
  this.titleLabel.text = 'Améliorations';
  this.firstBonusLabel.text = 'Laser de basse qualité, mais performant !';
  this.secondBonusLabel.text = 'Un laser puissant qui fait le ménage !';
  this.secondBonusLabel.x = 480;
  this.missile.visible = false;
  this.multiammo.visible = false;
  this.weapon1.visible = true;
  this.weapon2.visible = true;
},

tuto.goPrevious = function () {
  this.titleLabel.text = 'Bonus';
  this.firstBonusLabel.text = 'Le missile tête chercheuse fonce directement sur l\'ennemi le plus proche, easy peasy !';
  this.secondBonusLabel.text = 'Multiplie vos lasers   \\ | /';
  this.secondBonusLabel.x = 440;
  this.missile.visible = true;
  this.multiammo.visible = true;
  this.weapon1.visible = false;
  this.weapon2.visible = false;
},

module.exports = tuto;
