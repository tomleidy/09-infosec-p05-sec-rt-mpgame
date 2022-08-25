import {Defaults} from './Defaults.mjs';

import {preloadImages} from './generation.mjs'
import Player from './Player.mjs';
import {Collectible} from './Collectible.mjs';

const socket = io();

var connection = undefined;
var localPlayer = new Player(-1, -1, 0, -1, true);
var collectible = new Collectible(-1, -1, -1, -1);
var canvas, context;
var gameOver = false;

console.log(typeof(localPlayer));
console.log(localPlayer);

socket.on("connect", () => socket.emit("newplayer",localPlayer.getObj()))
socket.on("playerleft", id => localPlayer.delPlayer(id))
socket.on("playerlist", list => localPlayer.updatePlayerList(list))
socket.on("playerscore", (id, score) => localPlayer.updateScore(id, score))
socket.on("playermove", (player, direction) => localPlayer.remoteMove(player, direction))
socket.on("playerstop", (player, direction) => localPlayer.remoteStop(player, direction))
socket.on("newplayer", player => localPlayer.addPlayer(player))
socket.on("itemlist", list => collectible.addList(list))
socket.on("itemcollected", id => collectible.delete(id))
socket.on("itemnew", item => collectible.addNew(item))
socket.on("gameover", end => gameOver = end)

socket.onAny((event, ...args) => console.log(`onAny got: ${event}, args:`,JSON.stringify(args)))




if (typeof(document) == "object") { // to avoid crashing the tests.
    preloadImages();
    canvas = document.getElementById('game-window');
    context = canvas.getContext('2d');
    context.font = Defaults.font; 
}

if (typeof(window) == "object") {
    window.addEventListener('keydown', e => {
        var press = parseKey(e.key);
        if (press!=null) {
            socket.emit("move",localPlayer.getObj(),press)
            localPlayer.move(press);
        }
    });
    window.addEventListener('keyup', e => {
        var press = parseKey(e.key);
        if (press!=null) {
            localPlayer.stop(press);
            socket.volatile.emit("stop",localPlayer.getObj(), press)
        }
    });
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
    localPlayer.draw(context);
    collectible.getList().forEach(item => {
        if (localPlayer.collision(item) == true) {
            if (socket.id != undefined) {
                socket.emit("collision",localPlayer.getObj(),item.obj())
            } else {
                console.log("no connection, the cake is a lie")
            }
        };
    });
    collectible.draw(context);
    if (!gameOver) return requestAnimationFrame(drawBoard);
    context.font = Defaults.fontLarge;
    context.lineWidth = 1;
    context.fillStyle = "blueviolet";
    text = "You " + gameOver + "! Restart to play again"
    textWidth = context.measureText(text).width;
    var textX = (Defaults.width-textWidth)/2;
    context.fillText(text, textX, Defaults.height/3, Defaults.width-(2*Defaults.playBoxMarginSides))
}



const parseKey = (key) => {
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
        default:
            return null;
    }
}


if (typeof(window) == "object"){
    window.onload = e => {
        drawBoard();
    }
    window.onbeforeunload = e => {
        socket.disconnect();
    }

}
export default context;