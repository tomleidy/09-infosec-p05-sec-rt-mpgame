import {Defaults, playerBoxDefaults, collectibleBoxDefaults} from './Defaults.mjs';
import Player from './Player.mjs';
import {Collectible} from './Collectible.mjs';




const randInt = (max) => Math.floor(Math.random()*max)
const randXYPlayer = () => [randInt(playerBoxDefaults.width)+Defaults.playBoxMarginSides, randInt(playerBoxDefaults.height)+Defaults.playBoxMarginTop];
const randXYCollectible = () => [randInt(collectibleBoxDefaults.width)+Defaults.playBoxMarginSides, randInt(collectibleBoxDefaults.height)+Defaults.playBoxMarginTop]

const afterSlashBeforeDot = url => {
    var string = url.slice(0);
    while (string.indexOf("/") != -1) {
        string = string.slice(string.indexOf("/")+1)
    }
    return string.slice(0,string.indexOf("."));
}


var playerList = [];

const generatePlayer = () => {
    var xy = randXYPlayer();
    var id = new Date().valueOf()+randInt(5000);
    var local = playerList.length == 0 ? true : false
    var playerObj = {x: xy[0], y: xy[1], score: 0, id: id, local: local};
    //console.log(`playerObj:`,playerObj);
    var player = new Player(playerObj);
    return player;
} 


const generateCollectible = (x =-1, y =-1, id = -1, value =1) => {
    // only for local testing, should be provided by server.
    var xy = randXYCollectible();
    var id = new Date().valueOf();
    var value = randInt(Defaults.iconCollectibleList.length);
    x = xy[0];
    y = xy[1];
    var collectibleObj = {x: x, y: y, id: id, value: value}
    return new Collectible(collectibleObj)
}

export {randInt,randXYCollectible,randXYPlayer,generateCollectible,generatePlayer, playerList, afterSlashBeforeDot}