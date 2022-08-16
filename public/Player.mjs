class Player {
  constructor({x, y, score, id}) {
    this.x = x;
    this.y = y;
    this.score = score; // integers, incremented by 1
    this.id = id; // no idea what this is going to look like?
    // the id is a Date object
    
    this.icon = 
    // So if this is a general class for all players, to display the icon properly, I'm going to need to figure out how to tell which one is self and which is other.

    this.movePlayer = function(dir, speed) {
      // going to need edge detection
      console.log(`dir:`,dir);
      switch(dir) {
        case 'up':
          this.y -= speed;
          break;
        case 'down':
          this.y += speed;
          break;
        case 'left':
          this.x -= speed;
          break;
        case 'right':
          this.x += speed;
      }
      console.log(`dir, speed:`,dir, speed);
      return({x: this.x, y: this.y});
    }
    // figured out how to declare class methods. At last! I vaguely recall doing this in some of the React/Redux projects and not understanding ANY of it. So, this is progress. And I remember wondering how to do this properly in the Sudoku project? I think that was it. Yeah, I ended up trying to use getters/setters in creative ways.

    //return {x, y, score, id};
  }
  
  collision(item) {

  }


  calculateRank(arr) {
    console.log(`arr:`,arr);
  }
}

// I need to draw a player. HMM. But don't I need to do that during the connection? I should do that in a function just to see that it works.
// It looks like it will be easier to put that in the game.mjs file, because of the existence of the ... socket stuff? And the draw / onload stuff. We can move it wherever we need to when we figure out where it goes.


//const temp = new Player({ x: 100, y: 100, score: 0, id: Date.now() })
//movePlayer("up",5);

//console.log(temp.y);


export default Player;
