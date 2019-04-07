const async = require('async');

const config = require('../config');
const doDeployExokitSite = require('./deployExokitSite').doDeployExokitSite;
const utils = require('./utils');

const execCommand = utils.execCommand;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

/**
 * Run `bumpdocs` on the exokit-site repository and deploy.
 */
function bumpExokitDocs (data) {
  if (!shouldBumpDocs(data)) { return Promise.resolve(false); }

  return new Promise(resolve => {
    console.log(`Bumping Exokit docs...`);
    doDeployExokitSite(`Bump Exokit documentation (${data.compare}).`, () => {
      console.log(`Exokit docs successfully bumped!`);
      resolve(true);
    });
  });
}
module.exports.bumpExokitDocs = bumpExokitDocs;

/**
 * Check if Exokit commit has changes to the documentation.
 */
function shouldBumpDocs (data) {
  // Limit to master branch and documentation branches.
  if (data.ref !== 'refs/heads/master' && !data.ref.startsWith('refs/heads/docs-v')) {
    return false;
  }

  function commitHasDocsChanges (commit) {
    return commit.modified.concat(commit.added).concat(commit.removed).filter(file => {
      return file.startsWith('docs/') && file.endsWith('.md');
    }).length !== 0;
  }

  let hasDocsChanges = false;
  data.commits.forEach(commit => {
    if (commitHasDocsChanges(commit)) {
      hasDocsChanges = true;
    }
  });

  return hasDocsChanges;
}
module.exports.shouldBumpDocs = shouldBumpDocs;
