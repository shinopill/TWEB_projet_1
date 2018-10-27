// loads environment variables
require('dotenv/config');
const express = require('express');
const cors = require('cors');
const Github = require('./src/Github');
const utils = require('./src/utils');
const url = require('./client/js/resultUrl');

const app = express();
const port = process.env.PORT || 3000;
const client = new Github({ token: process.env.OAUTH_TOKEN });

// Enable CORS for the client app
app.use(cors());

app.get('/users/:username', (req, res, next) => {
  client.user(req.params.username)
    .then(user => res.send(user))
    .catch(next);
});

app.get('/users/:username/repos', (req, res, next) => {
  client.repos(req.params.username)
    .then(user => res.send(user))
    .catch(next);
});

app.get('/languages/:username', (req, res, next) => {
  client.userLanguages(req.params.username)
    .then(utils.getReposLanguagesStats)
    .then(stats => res.send(stats))
    .catch(next);
});

app.get('/users/:username/:repo/commits', (req, res, next) => {
  client.commit(req.params.username, req.params.repo)
    .then(commits => res.send(commits))
    .catch(next);
});

app.get('/languages/:owner/:repoName', (req, res, next) => {
  client.repoLanguages(req.params.owner, req.params.repoName)
    .then(languages => res.send(languages))
    .catch(next);
});

app.use(express.static(`${__dirname}/client`));

app.get('/', (req, res, next) => {
  res.render(`${__dirname}/client/index.html`)
    .catch(next);
});

// Forward 404 to error handler
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(err.status || 500);
  res.send(err.message);
});

app.use('/', express.static(`${__dirname}../client/index.html`));

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening at http://localhost:${port}`);
});
