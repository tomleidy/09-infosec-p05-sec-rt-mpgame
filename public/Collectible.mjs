import { Defaults } from './Defaults.mjs';
import { afterSlashBeforeDot } from './generation.mjs';



var collectibleList = []

class Collectible {
    constructor({ x, y, value, id }) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.id = id;
        this.getList = function() { return collectibleList }
        this.draw = function (context) {
            collectibleList.forEach(item => {
                if (x == -1) return false;
                let numIcons = Defaults.iconCollectibleList.length;
                if (item.value > numIcons) item.value = (item.value % numIcons);
                var id, image;
                let path = Defaults.iconCollectibleList[numIcons - item.value - 1]
                id = afterSlashBeforeDot(path);
                image = document.getElementById(id);
                context.drawImage(image, item.x, item.y, Defaults.sizeCollectible, Defaults.sizeCollectible);
            });

        }
        this.obj = function () {
            return Object({ x: this.x, y: this.y, id: this.id, value: this.value })
        }
        this.addNew = item => collectibleList.push(new Collectible(item));
        this.addList = arr => collectibleList = arr.map(c => new Collectible(c))
        this.delete = id => collectibleList = collectibleList.filter((d, i) => d.id != id)
    }
}


/*
  Note: Attempt to export this for use
  in server.js
*/
try {
    module.exports = Collectible;
} catch (e) { }

export { Collectible };