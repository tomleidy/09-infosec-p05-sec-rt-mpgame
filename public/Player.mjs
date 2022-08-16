import Defaults from './Defaults.mjs';


class Player {
  constructor({x = -1, y = -1, score = 0, id, icon, local = false}) {
    this.x = x;
    this.y = y;
    this.score = score; // integers, incremented by 1
    this.id = id; // no idea what this is going to look like?
    this.local = local;
    this.icon = local ? Defaults.iconPlayerSelf : Defaults.iconPlayerOther;
    // the id is a Date object
    //console.log(x, y, score, id, local);
    //this.icon = 
    // So if this is a general class for all players, to display the icon properly, I'm going to need to figure out how to tell which one is self and which is other.
    
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
        //console.log(`dir, speed:`,dir, speed);
        console.log(`dir: ${dir}, xy: (${this.x}, ${this.y})`)
        return({x: this.x, y: this.y});
      }
      
    // figured out how to declare class methods. At last! I vaguely recall doing this in some of the React/Redux projects and not understanding ANY of it. So, this is progress. And I remember wondering how to do this properly in the Sudoku project? I think that was it. Yeah, I ended up trying to use getters/setters in creative ways.
    
    //return {x, y, score, id};
    
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

// I need to draw a player. HMM. But don't I need to do that during the connection? I should do that in a function just to see that it works.
// It looks like it will be easier to put that in the game.mjs file, because of the existence of the ... socket stuff? And the draw / onload stuff. We can move it wherever we need to when we figure out where it goes.


//const temp = new Player({ x: 100, y: 100, score: 0, id: Date.now() })
//movePlayer("up",5);

//console.log(temp.y);


export default Player;
