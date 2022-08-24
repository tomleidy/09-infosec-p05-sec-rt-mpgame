require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const cors = require('cors');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

const helmet = require('helmet');
const nocache = require('nocache');

const { createServer } = require('http');
const { Server } = require('socket.io');
const { Defaults, playerBoxDefaults } = require('./public/Defaults.mjs');


const app = express();
const http = createServer(app);
const io = new Server(http)

//const { Player } = require('./public/Player.mjs');
// can't use the class properties due to Babel's configuration right now. Just gonna replicate some functions over here then.


app.use(helmet());
app.use(nocache());
app.use( (req, res, next) => {
  res.setHeader('X-Powered-By','PHP 7.4.3')
  next();
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({origin: '*'})); 

// Index page (static HTML)
app.route('/').get(function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
}); 
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));
//app.use('/socket.io',express.static(process.cwd() + '/node_modules/socket.io-client/dist/'))

// favicon
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
const server = http.listen(portNum, () => {
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
var socketList = {};
var collectibleList = [];
// a security note: make list of socket ids and player ids, check if they're identitcal. communicate player ids to clients, keep socket ids local. if the wrong playerid comes in from a socket, discard those commands, OR disconnect that socket (cheating).
var count = 0;

const validateNewPlayer = (obj, sockid) => {
  console.log(`obj`,count++,obj)
  if (obj.x == undefined || isNaN(obj.x)) return false;
  if (obj.y == undefined || isNaN(obj.x)) return false;
  if (obj.x <= 0 || obj.x >= playerBoxDefaults.width) return false;
  if (obj.y <= 0 || obj.y >= playerBoxDefaults.height) return false;
  var idx = Object.values(socketList).findIndex(playerid => obj.id == playerid) // looking for someone with the same player id; there should be no duplicates.
  if (idx != -1) return false;
  return true;
}

const fakePlayers = [{
  x: 344,
  y: 87,
  id: '1e84b061-702a-4354-b055-dc2728f148b3',
  score: 0
},{
  x: 142,
  y: 310,
  id: '0160dbdc-8544-4015-a015-764046a7f3bf',
  score: 0
}
]


//playerList.push(fakePlayers[1]);

const deletePlayer = id => {
  // not sure I need this. playerList should be whatever the server says it is. Do we let the client be skeptical of the server? It's mostly already written. Oops.
  console.log(`deleting:`,id)
  let playerIndex = playerList.findIndex(player => player.id == id)
  switch(playerIndex) {
    case -1:
      console.log(`player ${id} does not exist in local player list`);
      return false;
    case 0:
      playerList = playerList.slice(1);
      break;
    case playerList.length:
      playerList = playerList.slice(0,-1);
      break;
    default:
      playerList = [...playerList.slice(0,playerIndex), ...playerList.slice(playerIndex+1)]
      break;
    }
    //console.log(`new playerList:`,...playerList)
    return true

}


const validateSocket = (obj, sockid) => {
  if (socketList[sockid] == obj.id) return true;
  return false;
}

// do we want to do a full representation of the client data on the server? because that could be for the best, esp. if we're not taking the client is always trustworthy... how will i verify player movement?
// i need to figure out how fast it's going to propagate player movement, to avoid the appearance of lag.
// since we can't use static properties in Babel with our current understanding, we're going to just use very rudimentary server side stuff. We're even going to trust clients when they say they collide with an object. We're only going to check if that object is there still (because someone else may have gotten it first).

const playerObj = (x, y, id, score, sockid) => Object({x: x, y: y, id: id, score: score, sockid: sockid})
const playerObjExternal = ({x, y, id, score}) => Object({x: x, y: y, id: id, score: score}) // destructure player object and return a copy sans socket.id
const playerListExternal = () => playerList.map(p => playerObjExternal(p));

io.on('connection', (socket) => {
  // run collectibles.populate() here

  console.log("user connected");
  // new player
  socket.onAny((event, ...args) => {
    // I just realized I need to standardize arguments so player object or player id are the first argument after the event name, every time.
    console.log()
  })
  socket.on('newplayer', arg => {
    //console.log(`arg:`,arg)

    if (validateNewPlayer(arg, socket.id)) {
      console.log(`socket.id`,{[socket.id]: arg.id})
      socketList = {...socketList, [socket.id]: arg.id}
      playerList.push(playerObj(arg.x, arg.y, arg.id, 0, socket.id))
      console.log(playerListExternal());
      io.emit("playerlist", playerListExternal())
    } else { socket.disconnect() }
    console.log(`socketList:`,socketList);
  })
  // announce collectibles
  socket.on('collision', (player, item) => {
    if (true) { // running our own collision detection on coordinates and objects.
      console.log(`collision: player ${player.id} with item ${item.id}`);
      io.emit("itemcollected",item.id)
      // run collectibles populate
    }
  });
  socket.on('disconnect', arg => {
    console.log("user disconnected", socket.id, socketList[socket.id]);
    socket.emit('playerleft', socketList[socket.id])
    
    deletePlayer(socketList[socket.id]);
    delete socketList[socket.id];
  })
  socket.onAny((event, ...args) => {
    //console.log(`onAny, ${event}, args:`,args)
  })
});


// let's talk about what events there will be that I need the server and the client to communicate.

// X connection 
// X disconnection
// X new player (player sends coordinates)
// X player collides with item (player sends)da
// player movement (player sends local movement/coordinates)
// player stops movement (player sends coordinates)

// player movement (server sends other player movement)
// destroy item (server sends), we're not going to check the coordinate boundaries, just accept them. ripe for cheating with modified JS, but ... what low stakes?
// create new item (server sends)

// player list updates (server sends)

// gameover (server sends)
// what else?

//io.use()