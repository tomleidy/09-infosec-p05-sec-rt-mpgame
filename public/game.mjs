import {Defaults, playerBoxDefaults, collectibleBoxDefaults} from './Defaults.mjs';

import {afterSlashBeforeDot} from './generation.mjs'
import Player from './Player.mjs';
import {Collectible} from './Collectible.mjs';

const socket = io();

var connection = undefined;
socket.on("connect", () => {
    console.log("announcing local player",localPlayer.obj());
    socket.emit("newplayer",localPlayer.obj())
//    console.log(socket)
})
console.log(socket.id);

const imagesArr = [];
imagesArr.push(Defaults.iconPlayerSelf);
imagesArr.push(Defaults.iconPlayerOther);
Defaults.iconCollectibleList.map(d => imagesArr.push(d));

const preloadImages = () => {
    const preloadDiv = document.getElementById("preload");
    
    imagesArr.map((url, i) => {
        // I saw something that was like var img = new Image(); img.src = url but I got this to work before understanding that. That might be more optimal. I'll find out someday.
        let id = afterSlashBeforeDot(url);
        var html = `<img id="${id}" style="visibility: hidden;" height=1 width=1 src="${url.slice(1)}"></img>`
        preloadDiv.insertAdjacentHTML("afterbegin",html);
    })
    
}
var canvas, context;
var localPlayer = Player.generate();


if (typeof(document) == "object") { // to avoid crashing the tests.
    preloadImages();
    canvas = document.getElementById('game-window');
    context = canvas.getContext('2d');
    context.font = Defaults.font; 
    Player.addPlayer(localPlayer); // I don't think I need this. I only need localPlayer to operate, and to make sure the drawBoard function doesn't duplicate it
}

if (typeof(window) == "object") {
    window.addEventListener('keydown', e => {
        var press = parseKey(e.key);
        if (press!=null) localPlayer.move(press);
    });
    window.addEventListener('keyup', e => {
        var press = parseKey(e.key);
        if (press!=null) localPlayer.stop(press);
    });
}
var gameOver = false;

class Emit {
    static collision = function(playerid, item) {}
    static movePlayer = function(playerid, direction) {}
    static stopPlayer = function(playerobj, direction) {}
    // passing player because coordinates
    static newPlayer = function(player) {}
    static disconnect = function(playerid) {}
    // X new player (player sends coordinates)
// X player collides with item (player sends)
// player movement (player sends local movement/coordinates)
// player stops movement (player sends coordinates)

}



const drawBoard = () => {
    var textWidth, text, collisionObj;
    context.font = Defaults.font; 
    context.clearRect(0,0, Defaults.width,Defaults.height);
    context.fillStyle = Defaults.fill;
    context.fillRect(0, 0, Defaults.width, Defaults.height);
    context.strokeStyle = Defaults.stroke;
    context.strokeRect(Defaults.playBoxX,Defaults.playBoxY, Defaults.width-10, Defaults.height-35)
    context.fillStyle = Defaults.text;
    context.fillText("Controls: WASD", 7, 22, (Defaults.width/3)-7)
    
    text = localPlayer.calculateRank();
    textWidth = context.measureText(text).width;
    context.fillStyle = Defaults.fontMedium;
    textWidth = context.measureText(Defaults.title).width;
    context.fillText(Defaults.title, (Defaults.width-textWidth)/2, 22, Defaults.width*(2/3))
    context.fillText(text, Defaults.width-(textWidth+7), 22, Defaults.width/3)
    Player.list.forEach(player => {
        player.draw(context);
        Collectible.list.forEach(item => {
            if (player.collision(item) == true) {
                //console.log(item);
                player.score+= item.value+1
                if (socket.id != undefined) {
                    collisionObj = {player: player.id, item: item.id, value: item.value}
                    //console.log(collisionObj);
                    socket.emit("collision",collisionObj)
                } else {
                    console.log("no connection, the cake is a lie")
                }
                item.delete(); // we'll be changing this when the server is keeping track of items.
            };
        });
    })
    Collectible.populate();
    Collectible.list.forEach(item => {
        item.draw(context);
    })
    if (!gameOver) return requestAnimationFrame(drawBoard);
    context.font = Defaults.fontLarge;
    context.lineWidth = 1;
    context.fillStyle = "blueviolet";
    text = "You " + gameOver + "! Restart to play again"
    textWidth = context.measureText(text).width;
    var textX = (Defaults.width-textWidth)/2;
    context.fillText(text, textX, Defaults.height/3, Defaults.width-(2*Defaults.playBoxMarginSides))
}



const parseKey = (key,keyup = false) => {
    switch(key) {
        case "W":
        case "w":
        case "ArrowUp":
            return "up";
        case "A":
        case "a":
        case "ArrowLeft":
            return "left";
        case "S":
        case "s":
        case "ArrowDown":
            return "down";
        case "D":
        case "d":
        case "ArrowRight":
            return "right";
        case "x":
            if (keyup==false) localPlayer.clearCount();
        default:
            return null;
    }
}


//animate = requestAnimationFrame(drawBoard);
if (typeof(window) == "object"){
    window.onload = e => {
        drawBoard();
    }
    window.onbeforeunload = e => {
        socket.disconnect();
    }

}
export default context;