



class Player {
  constructor({x, y, score, id}) {
    this.x = x;
    this.y = y;
    this.score = score; // integers, incremented by 1
    this.id = id; // no idea what this is going to look like?
    // the id is a Date object
    
    return {x, y, score, id};
  }
  movePlayer(dir, speed) {
    // going to need edge detection
    console.log(`dir:`,dir)
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
