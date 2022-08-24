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
const { collectibleRandX, collectibleRandY, randInt } = require('./public/generation.mjs')


const { v4 } = require('uuid');
const collectibleGenerate = () => {
    var id = v4();
    var value = randInt(Defaults.iconCollectibleList.length);
    var x = collectibleRandX();
    var y = collectibleRandY();
    var collectibleObj = {x: x, y: y, id: id, value: value}
    return collectibleObj
}

const collectiblePopulate = (list) => {  
    if (list.length >= Defaults.maxCollectibles) return list;
    var newList = [...list];
    while (newList.length < Defaults.maxCollectibles){
        newList.push(collectibleGenerate());
    }
    return newList;
}

const collectibleCollect = (id) => {
  let idx = collectibleList.findIndex(c => c.id == id)
  if (idx == -1) return false;
  collectibleList = collectibleList.filter((c, i) => i != idx)
  return true;
}
const collectibleAddToList = obj => collectibleList.push(obj);


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
var collectibleList = collectiblePopulate([]);
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


playerList.push(...fakePlayers);

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


const playerObj = (x, y, id, score, sockid) => Object({x: x, y: y, id: id, score: score, sockid: sockid})
const playerObjExternal = ({x, y, id, score}) => Object({x: x, y: y, id: id, score: score}) // destructure player object and return a copy sans socket.id
const playerListExternal = () => playerList.map(p => playerObjExternal(p));
const playerGetScore = id => playerList.find(p => p.id == id).score
const playerAddToScore = (id, value) => playerList.find(p => p.id == id).score += value;
io.on('connection', (socket) => {

  console.log("user connected");
  // new player
  socket.on('newplayer', arg => {
    if (validateNewPlayer(arg, socket.id)) {
      console.log(`socket.id`,{[socket.id]: arg.id})
      socketList = {...socketList, [socket.id]: arg.id}
      playerList.push(playerObj(arg.x, arg.y, arg.id, 0, socket.id))
      socket.emit("playerlist", playerListExternal())
      socket.emit("itemlist",collectibleList)
    } else { socket.disconnect() }
    console.log(`socketList:`,socketList);
  })

  socket.on('collision', (player, item) => {
    if (true) { // running our own collision detection on coordinates and objects.
      io.emit("itemcollected",item.id)
      if (collectibleCollect(item.id)) {
        var score = playerGetScore(player.id);
        console.log(score);
        if (score>=Defaults.gameOverScore) {
          socket.emit("gameover","win");
          socket.broadcast.emit("gameover","lose");
        } else {
          var newItem = collectibleGenerate();
          playerAddToScore(player.id, item.value);
          collectibleAddToList(newItem)
          io.emit("itemnew",newItem)
        }
      }
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