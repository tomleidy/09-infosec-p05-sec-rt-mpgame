const urlIconCollectible1 = "/icons/collectibles/avocado.png";
const urlIconCollectible2 = "/icons/collectibles/burn.png";
const urlIconCollectible3 = "/icons/collectibles/cake-slice.png";
const iconCollectibleList = [urlIconCollectible1, urlIconCollectible2,urlIconCollectible3];
const sizeCollectible = 10;

class Collectible {
  constructor({x, y, value, id}) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
    return {x, y, value, id}
  }

}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch(e) {}

export default Collectible;
