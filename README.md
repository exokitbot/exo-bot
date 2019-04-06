# exo-bot

Exokit GitHub bot.

![exo-bot](https://avatars0.githubusercontent.com/u/49332553?s=460&v=4)

[Latest Exokit GitHub Pages](https://exo-bot.github.io/exokit/)

Deployed on AWS.

## Actions

- When the Exokit code or package.json is updated, bump the Exokit master
  builds and the bot's fork's GitHub Pages of Exokit.
- When the Exokit master builds are bumped: update README, package.json, and bump again.
- When the Exokit documentation is updated, deploy the documentation on the Exokit site.
- When a contributor comments `@exo-bot docs-v0.4.0` on a commit, cherry-pick
  the commit to the documentation branch and deploy the Exokit site.
- When the Exokit site is updated, deploy the Exokit site to `exokitxr/exokitxr.github.io`.

## AWS Setup

Open inbound ports in the AWS Security Group on the console. exo-bot defaults
to port 5000 for production and port 5001 for staging.

```sh
sudo apt-get install git node npm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
bash && nvm install v6
git clone git@github.com:exo-bot/exo-bot && cd exo-bot && npm install
cp tokens.js.dist tokens.js
```

Have a GitHub account and get a GitHub personal access token. Put the token
in `tokens.js` as `GITHUB_TOKEN`.

Give the GitHub bot account write access to the managed repositories.

Get the AWS public URL and set up a GitHub webhook on the managed repositories
pointing to `/postreceive`. Give the webhook a secret token. Put the webhook
token in `tokens.js` as `SECRET_TOKEN`. Make sure the content type for the
webhook is set to `application/json`.

```sh
npm install -g forever
npm run start
forever logs 0
```

For proper functioning, the instance should have at least 2GB of RAM, and the
instance's volume should have at least 2GB of storage.

### Staging

```sh
npm run startstaging
```

## Repository Setup

- exokitxr/exokit - Webhook + Write Access
- exokitxr/exokit-site - Webhook
- exokitxr/exokitxr.github.io - Write Access
- exo-bot/exokit - Fork
