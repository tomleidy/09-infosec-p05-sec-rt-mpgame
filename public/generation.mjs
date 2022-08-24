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



export {randInt,afterSlashBeforeDot}