const stagingConfig = require('./config.staging');

let config = {
  contributors: ['exo-bot', 'modulesio', 'chrisplatorres'],
  repo: 'exokitxr/exokit',
  repoSite: 'exokitxr/exokit-site',
  repoSitePages: 'exokitxr/exokitxr.github.io',
  userEmail: 'hello@webmr.io',
  userName: 'exo-bot'
};

if (process.env.EXOBOT_ENV === 'staging' || process.env.EXOBOT_ENV === 'test') {
  config = Object.assign(config, stagingConfig);
}

module.exports = config;
