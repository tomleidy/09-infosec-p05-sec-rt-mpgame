require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const cors = require('cors');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

const helmet = require('helmet');
const nocache = require('nocache');

const app = express();
const http = require('http');
const io = require('socket.io')(http)



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

  app.route('/favicon.ico').get((req, res) => {
    res.sendFile(process.cwd() + "/public/favicon.ico")
});

//For FCC testing purposes
fccTestingRoutes(app);

app.route('/icons/:file').get((req, res) => {
  res.sendFile(process.cwd() + '/public/icons/' + req.params.file);
})

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


module.exports = app; // For testing

var playerList = [];
var collectibleList = [];

// let's talk about what events there will be that I need the server and the client to communicate.

// connection
// disconnection
// new player (player sends coordinates)
// player movement (player sends coordinates)
// player stops movement (player sends coordinates)
// player collides with item (player sends)
// gameover (server sends)
// destroy item (server sends)
// create new item (server sends)
// what else?

//io.use()