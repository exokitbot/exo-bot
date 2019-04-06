const async = require('async');

const config = require('../config');
const utils = require('./utils');

const execCommand = utils.execCommand;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

/**
 * Deploy Exokit site.
 */
function deployExokitSite (data) {
  return new Promise(resolve => {
    console.log(`Deploying Exokit site...`);
    doDeployExokitSite(`Deploy Exokit site (${data.compare}).`,
                       () => { resolve(true); });
  });
}
module.exports.deployExokitSite = deployExokitSite;

/**
 * Reusable function to deploy Exokit site without any checks.
 */
function doDeployExokitSite (message, cb) {
  async.series([
    execCommand('git reset --hard HEAD', 'exokit-site'),
    execCommand('git reset --hard HEAD', 'exokitxr.github.io'),
    execCommand('git pull --rebase origin master', 'exokit-site'),
    execCommand('git pull --rebase origin master', 'exokitxr.github.io'),
    execCommand('npm install --only="dev"', 'exokit-site'),
    execCommand('npm install', 'exokit-site'),
    execCommand('npm run bumpdocs', 'exokit-site'),
    execCommand('npm run generate', 'exokit-site'),
    execCommand('rm -rf *', 'exokitxr.github.io'),
    execCommand('cp -r public/* ../exokitxr.github.io', 'exokit-site'),
    execCommand('git status', 'exokitxr.github.io'),
    execCommand('git add .', 'exokitxr.github.io'),
    execCommand(`git commit -m "${message}"`, 'exokitxr.github.io'),
    execCommand(
      `git push https://${GITHUB_TOKEN}@github.com/${config.repoSitePages}.git master`,
      'exokitxr.github.io')
  ], function asyncSeriesDone (err) {
    if (err) { return console.error(err); }
    console.log(`Exokit site successfully deployed!`);
    cb();
  });
}
module.exports.doDeployExokitSite = doDeployExokitSite;
