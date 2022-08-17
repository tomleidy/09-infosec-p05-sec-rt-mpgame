import Defaults from './Defaults.mjs';


class Player {
  constructor({x = -1, y = -1, score = 0, id, icon, local = false}) {
    this.x = x;
    this.y = y;
    this.score = score; // integers, incremented by 1
    this.id = id; // no idea what this is going to look like?
    this.local = local;
    this.icon = local ? Defaults.iconPlayerSelf : Defaults.iconPlayerOther;

    this.movePlayer = function(dir, speed = Defaults.speed) {
      // going to need edge detection
      var halfPlayer = Math.floor(Defaults.sizePlayer/2)+1; // always want there to be space against the stroke box.
      var newPos;
      switch(dir) {
        case 'up':
          var topMargin = Defaults.playBoxMarginTop;
          var highestY = topMargin + halfPlayer;
          newPos = this.y - speed;
          if (newPos > highestY) {
            this.y = newPos;
          } else {
            this.y = highestY;
          }
          break;
          case 'down':
            var bottomMargin = Defaults.height-Defaults.playBoxMarginBottom;
            var lowestY = bottomMargin - halfPlayer;
            newPos = this.y + speed;
            if (newPos < lowestY) {
              this.y = newPos;
          } else {
            this.y = lowestY;
          }
          this.y += speed;
          break;
          case 'left':
            var leftMargin = Defaults.playBoxMarginSides;
          var leftestX = leftMargin + halfPlayer;
          newPos = this.x - speed;
          if (newPos > leftestX) {
            this.x = newPos;
          } else {
            this.x = leftestX;
          }
          break;
        case 'right':
          var rightMargin = Defaults.width - Defaults.playBoxMarginSides;
          var rightestX = rightMargin - halfPlayer;
          newPos = this.x + speed;
          if (newPos < rightestX) {
            this.x = newPos;
          } else {
            this.x = rightestX;
          }
        }
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
