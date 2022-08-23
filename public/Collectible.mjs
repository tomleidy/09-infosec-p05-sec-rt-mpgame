import {Defaults, playerBoxDefaults, collectibleBoxDefaults} from './Defaults.mjs';
import { randInt, afterSlashBeforeDot, generateCollectible} from './generation.mjs';

//import context from './game.mjs'

//import {randXYCollectible, randXYPlayer, generateCollectible, generatePlayer, playerList} from './generation.mjs'

var collectibleList = []; // should only be one at any given time, but we'll keep the array method for now. OH, I could make that a change. Hmm. Maybe. We'll see. I think it would be an increase in computational complexity, but... It should be manageable, computers are faster than they were when you were a kid. Also maybe not that much if there's only three, and it's client side for collision detection.


class Collectible {
  constructor({x, y, value, id}) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
    this.draw = function(context) {
      let numIcons = Defaults.iconCollectibleList.length;
      if (this.value > numIcons) this.value = (this.value % numIcons);
      var id, image;
      let path = Defaults.iconCollectibleList[numIcons-this.value-1]
      id = afterSlashBeforeDot(path);
      image = document.getElementById(id);
      context.drawImage(image, this.x, this.y, Defaults.sizeCollectible, Defaults.sizeCollectible);

    }
    this.delete = function() {
      let itemIdx = Collectible.list.indexOf(this)
      Collectible.list = Collectible.list.filter((d,i) => i != itemIdx)
    }
  }
  static populate () {
    if (this.list.length >= Defaults.maxCollectibles) return false;
    this.list.push(generateCollectible());
  }
  static list = [];
}


/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch(e) {}

export {Collectible};