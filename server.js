// I have just learned that this is all that's needed to meet the criteria of the projects tests as they stand today, 2022/08/12 (visible at https://github.com/freeCodeCamp/freeCodeCamp/blob/main/curriculum/challenges/english/09-information-security/information-security-projects/secure-real-time-multiplayer-game.md). I am experiencing pain about this. Not only is the project difficulty much higher than I expected, the testing for it is incomplete. No guiderails. Oh well. Let's see if I can figure out Canvas and segment.io enough to make me feel "that's similar to the example project."

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const socket = require('socket.io');
const cors = require('cors');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

const helmet = require('helmet');
const nocache = require('nocache');
const Server = require('socket.io');

const app = express();



app.use(helmet());
app.use(nocache());
app.use( (req, res, next) => {
  res.setHeader('X-Powered-By','PHP 7.4.3')
  next();
})

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({origin: '*'})); 

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  }); 

app.route('/favicon.ico').get((req, res) => res.sendFile(process.cwd() + "/public/favicon.ico"));

//For FCC testing purposes
fccTestingRoutes(app);
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

const io = new Server(server)

module.exports = app; // For testing
