import {Defaults, playerBoxDefaults, collectibleBoxDefaults} from './Defaults.mjs';
import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const randInt = (max) => Math.floor(Math.random()*max)
const randXYPlayer = () => [randInt(playerBoxDefaults.width)+Defaults.playBoxMarginSides, randInt(playerBoxDefaults.height)+Defaults.playBoxMarginTop];
const randXYCollectible = () => [randInt(collectibleBoxDefaults.width)+Defaults.playBoxMarginSides, randInt(collectibleBoxDefaults.height)+Defaults.playBoxMarginTop]

var playerList = [];

const generatePlayer = () => {
    var xy = randXYPlayer();
    var id = new Date().valueOf();
    var local = playerList.length == 0 ? true : false
    var playerObj = {x: xy[0], y: xy[1], score: 0, id: id, local: local};
    //console.log(`playerObj:`,playerObj);
    var player = new Player(playerObj);
    return player;
} 


const generateCollectible = ({x =-1, y =-1, id = -1, value =1}) => {
    if (x < 0) {
        // only for local testing, should be provided by server.
        var xy = randXYCollectible();
        var id = new Date().valueOf();
        x = xy[0];
        y = xy[1];
        value = (numIcons - num)*2;
    }
    let numIcons = Defaults.iconCollectibleList.length;
    let num = randInt(numIcons);
    var icon = Defaults.iconCollectibleList[randInt(numIcons)];
    var collectibleObj = {}
    return new Collectible()
}

export {randInt,randXYCollectible,randXYPlayer,generateCollectible,generatePlayer, playerList}