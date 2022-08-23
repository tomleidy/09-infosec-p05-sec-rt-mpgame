import {Defaults, playerBoxDefaults} from './Defaults.mjs';
import Player from './Player.mjs';
import {Collectible} from './Collectible.mjs';




const randInt = (max) => Math.floor(Math.random()*max)

const afterSlashBeforeDot = url => {
    var string = url.slice(0);
    while (string.indexOf("/") != -1) {
        string = string.slice(string.indexOf("/")+1)
    }
    return string.slice(0,string.indexOf("."));
}


const generatePlayer = () => {
    var xy = randXYPlayer();
    var id = crypto.randomUUID();
    var local =  playerList.length == 0 ? true : false
    var playerObj = {x: xy[0], y: xy[1], score: 0, id: id, local: local};
    var player = new Player(playerObj);
    return player;
} 



export {randInt,afterSlashBeforeDot}