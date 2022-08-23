import {Defaults, playerBoxDefaults} from './Defaults.mjs';
import {afterSlashBeforeDot,randInt} from './generation.mjs'

var count = 100;

const randX = () => randInt(playerBoxDefaults.width)+Defaults.playBoxMarginSides
const randY = () => randInt(playerBoxDefaults.height)+Defaults.playBoxMarginTop

class Player {
  constructor({x = -1, y = -1, score = 0, id, local = false}) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id; 
    this.local = this.id == Player.localId ? true : local;
    this.scoreAdd = function(value) { this.score += value; }
    this.movePlayer = function(dir, speed = Defaults.speed) {
      var newPos;
      switch(dir) {
        case 'up':
          newPos = this.y - speed;
          if (newPos > playerBoxDefaults.minY) { // newPos needs to be GT minY
            this.y = newPos;
          } else {
            this.y = playerBoxDefaults.minY+1;
          }
          break;
          case 'down':
            newPos = this.y + speed;
            if (newPos < playerBoxDefaults.maxY) { 
              this.y = newPos;
            } else {
              this.y = playerBoxDefaults.maxY-1;
            }
            break;
          case 'left':
            newPos = this.x - speed;
            if (newPos > playerBoxDefaults.minX) {
              this.x = newPos;
            } else {
              this.x = playerBoxDefaults.minX+1;
            }
            break;
          case 'right':
            newPos = this.x + speed;
            if (newPos < playerBoxDefaults.maxX) {
              this.x = newPos;
            } else {
              this.x = playerBoxDefaults.maxX-1;
            }
          }
        return({x: this.x, y: this.y});
      }
    this.get = () => Object({x: this.x, y: this.y, id: this.id, score: this.score})
    this.clearCount = function() { count = 0 }
    this.collision = function(item) {
      // I need to draw this.
      let iSize = Defaults.sizeCollectible;
      let pSize = Defaults.sizePlayer;
      // Oof. This all works, but I should have checked the item against the player (because item is smaller). There's a gap in the middle of the player sides that doesn't get detected.
      if (pSize > iSize) {
        if (item.x > this.x && item.x < this.x+pSize && item.y > this.y && item.y < this.y+pSize) return true; // item UL corner
        if (item.x+iSize > this.x && item.x+iSize < this.x+pSize && item.y > this.y && item.y < this.y+pSize) return true; // item UR corner
        if (item.x > this.x && item.x < this.x+pSize && item.y+iSize > this.y && item.y < this.y+pSize) return true; // item LL corner
        if (item.x+iSize > this.x && item.x+iSize < this.x+pSize && item.y+iSize > this.y && item.y+iSize < this.y+pSize) return true;
      } else {
        // I already coded it. Who knows? Maybe the players go to giant land.  
        if (this.x+pSize > item.x && this.x+pSize<item.x+iSize && this.y > item.y && this.y < item.y+iSize) return true; // UR corner
        if (this.x > item.x && this.x < item.x+iSize && this.y > item.y && this.y < item.y+iSize) return true; // UL corner
        if (this.x > item.x && this.x<item.x+iSize && this.y+pSize > item.y && this.y+pSize < item.y+iSize) return true; // LL corner
        if (this.x+pSize > item.x && this.x+pSize < item.x+iSize && this.y+pSize > item.y && this.y+pSize < item.y+iSize) return true; // LR corner
      } // I don't know how to make this accommodate player and item being the same size. Hope I never have to find out.
      return false
    }
    this.draw = function(context) {
      var id, image;
      if (this.local) { 
          id = afterSlashBeforeDot(Defaults.iconPlayerSelf);
      } else {
          id = afterSlashBeforeDot(Defaults.iconPlayerOther);
      }
      image = document.getElementById(id);
      context.drawImage(image, this.x, this.y, Defaults.sizePlayer, Defaults.sizePlayer);
    
    }

    this.calculateRank = function() {
      var toSort = [...Player.list];
      var number = toSort.length;
      var sorted = toSort.sort((p1, p2) => {
        if (p1.score > p2.score) return -1;
        if (p1.score < p2.score) return 1;
        return 0;
      })
      var tempScore;
      sorted.find((e, i) => {
        if (count<arr.length) console.log(count++,i,JSON.stringify(e));
        if (e.id == this.id) tempScore = i+1;
      })
      var string = `Rank: ${tempScore} / ${number}`
      return string;
    }
  }
  static generate = () => {
    var x = randX();
    var y = randY();
    var id = crypto.randomUUID();
    var local =  true;
    var playerObj = {x: x, y: y, score: 0, id: id, local: local};
    var player = new Player(playerObj);
    Player.localPlayer = player;
    return player;
  } 
  static deletePlayer = id => {
    // not sure I need this. playerList should be whatever the server says it is. Do we let the client be skeptical of the server? It's mostly already written. Oops.
    let playerIndex = this.list.find(player => player.id == id)
    switch(playerIndex) {
      case -1:
        console.log(`player ${id} does not exist in local player list`);
        return false;
      case 0:
        this.list = this.list.slice(1);
        return true;
      case this.list.length:
        this.list = this.list.slice(0,-1);
        return true;
    }

  }
  static localPlayer = Player;
  static localId = String;
  static addPlayer = (object) => this.list.push(object);
  static updatePlayerList = arr => {
    // only to be called by socket.io
    var tempList = [];
    arr.map(player => {
      if (player.id == Player.localId) {
        tempList.shift(Player.localPlayer); // always put local data in first
      } else {
        tempList.push(player);
      }
    })
    Player.list = tempList;
  }
  static list = [];
}





export default Player;
