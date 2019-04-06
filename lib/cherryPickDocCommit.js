const async = require('async');
const config = require('../config');
const utils = require('./utils');
const doDeployExokitSite = require('./deployExokitSite').doDeployExokitSite;

const execCommand = utils.execCommand;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

/**
 * Cherry-pick commit to documentation branch. Then deploy site.
 */
function cherryPickDocCommit (data) {
  if (!shouldCherryPickDocCommit(data)) { return Promise.resolve(false); }

  return new Promise(resolve => {
    const branch = getBranchesFromMsg(data.comment.body)[0];
    console.log(`Cherry-picking doc commit for ${branch}...`);

    async.series([
      execCommand('git reset --hard HEAD', 'exokit'),
      execCommand('git pull --rebase origin master', 'exokit'),
      execCommand(`git fetch origin ${branch}:${branch}`, 'exokit'),
      execCommand(`git checkout ${branch}`, 'exokit'),
      execCommand(`git cherry-pick ${data.comment.commit_id}`, 'exokit'),
      execCommand(
        `git push https://${GITHUB_TOKEN}@github.com/${config.repo}.git ${branch}`,
        'exokit'),
      execCommand(`git cherry-pick --abort`, 'exokit'),
      execCommand(`git checkout master`, 'exokit')
    ], function asyncSeriesDone (err) {
      if (err) { return console.error(err); }
      console.log(`Exokit doc commit successfully cherry-picked!`);

      doDeployExokitSite(`Picked ${data.comment.commit_id} to ${branch}`, () => {
        resolve(true);
      });
    });
  });
}
module.exports.cherryPickDocCommit = cherryPickDocCommit;

/**
 * Check if comment is asking for a cherry-pick.
 */
function shouldCherryPickDocCommit (data) {
  return data.comment &&
         data.comment.body &&
         data.comment.body.startsWith(`@${config.userName}`) &&
         data.comment.body.indexOf('docs-v') !== -1 &&
         config.contributors.indexOf(data.comment.user.login) !== -1;
}
module.exports.shouldCherryPickDocCommit = shouldCherryPickDocCommit;

/**
 * Get which branches to cherry-pick from the message.
 */
function getBranchesFromMsg (message) {
  return message.match(/docs-v\d+\.\d+.\d+/g);
}
module.exports.getBranchesFromMsg = getBranchesFromMsg;
