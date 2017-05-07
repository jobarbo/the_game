var npmProperties = require('../../../package.json');

module.exports = {
  title: 'Phaser JS Boilerplate',
  description: npmProperties.description,
  port: 3017,
  liveReloadPort: 3018,
  mute: false,
  score: 0,
  showStats: false,
  size: {
    x: 800,
    y: 600
  },
  analyticsId: 'UA-50892214-2'
};
