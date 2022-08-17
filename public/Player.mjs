import {Defaults, boxDefaults} from './Defaults.mjs';




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
          if (newPos > boxDefaults.playerMinY) { // newPos needs to be GT minY
            this.y = newPos;
          } else {
            this.y = boxDefaults.playerMinY+1;
          }
          break;
          case 'down':
            newPos = this.y + speed;
            if (newPos < boxDefaults.playerMaxY) { 
              this.y = newPos;
            } else {
              this.y = boxDefaults.playerMaxY-1;
            }
            break;
          case 'left':
            newPos = this.x - speed;
            if (newPos > boxDefaults.playerMinX) {
              this.x = newPos;
            } else {
              this.x = boxDefaults.playerMinX+1;
            }
            break;
          case 'right':
            newPos = this.x + speed;
            if (newPos < boxDefaults.playerMaxX) {
              this.x = newPos;
            } else {
              this.x = boxDefaults.playerMaxX-1;
            }
          }
          console.log(`newPos:`,newPos)
          console.log(`x, y:`,this.x,this.y)

        return({x: this.x, y: this.y});
      }
      
    
  }

  collision(item) {

  }


  calculateRank(arr) {
    var number = arr.length;
    var sorted = arr.sort((p1, p2) => {
      if (p1.score > p2.score) return -1;
      if (p1.score < p2.score) return 1;
      return 0;
    })
    var index
    sorted.find((e, i) => {
      if (e.id == this.id) index = i+1;
    })
    var string = `Rank: ${index} / ${number}`
    return string;
  }
}



export default Player;
