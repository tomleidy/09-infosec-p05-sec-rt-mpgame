class Collectible {
  constructor({x, y, value, id, icon}) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
    this.drawCollectible = function() {}
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

export default Collectible;