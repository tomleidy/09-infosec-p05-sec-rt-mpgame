import {Defaults, playerBoxDefaults, collectibleBoxDefaults} from './Defaults.mjs';
import { randInt, afterSlashBeforeDot } from './generation.mjs';
import context from './game.mjs'

//import {randXYCollectible, randXYPlayer, generateCollectible, generatePlayer, playerList} from './generation.mjs'

var collectibleList = []; // should only be one at any given time, but we'll keep the array method for now. OH, I could make that a change. Hmm. Maybe. We'll see. I think it would be an increase in computational complexity, but... It should be manageable, computers are faster than they were when you were a kid. Also maybe not that much if there's only three, and it's client side for collision detection.



class Collectible {
  constructor({x, y, value, id}) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
    this.draw = function() {
      let numIcons = Defaults.iconCollectibleList.length;
      if (this.value > numIcons) this.value = this.value % numIcons;
      var id, image;
      id = afterSlashBeforeDot(Defaults.iconCollectibleList[numIcons-this.value]);
      image = document.getElementById(id);
      // ok, we're going to go with values consistent with sequence in the array (). we're guessing that the server will have the correct number of icons, but let's not take any chances here.
      context.drawImage(image, this.x, this.y, Defaults.sizeCollectible, Defaults.sizeCollectible);

    }
    //return {x, y, value, id}
  }

}
// looks like we're going to need to add drawCollectible to the drawBoard function over in game.mjs. Once we figure out Collectible drawing/values (I want the cake to be 5 points, the avocado 3, and the toast 1), because avocadoes are more important than toast, but the toast helps.
// Ugh I am such a millennial.


/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch(e) {}

export {Collectible, collectibleList};