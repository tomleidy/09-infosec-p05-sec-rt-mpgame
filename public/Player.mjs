import {Defaults, playerBoxDefaults, collectibleBoxDefaults} from './Defaults.mjs';




class Player {
  constructor({x = -1, y = -1, score = 0, id, icon, local = false}) {
    this.x = x;
    this.y = y;
    this.score = score; // integers, incremented by 1
    this.id = id; // no idea what this is going to look like?
    this.local = local;
    this.icon = local ? Defaults.iconPlayerSelf : Defaults.iconPlayerOther;

    this.movePlayer = function(dir, speed = Defaults.speed) {
      var newPos;
      //console.log(`movePlayer dir, speed:`,dir,speed)
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
      this.calculateRank = function(arr) {
        var number = arr.length;
        var sorted = arr.sort((p1, p2) => {
          if (p1.score > p2.score) return -1;
          if (p1.score < p2.score) return 1;
          return 0;
        })
        var index
        sorted.find((e, i) => {
          if (e.id == this.id) index = i;
        })
        var string = `Rank: ${index} / ${number}`
        return string;
      }
    }
    
  }





export default Player;
