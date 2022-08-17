import {Defaults, boxDefaults} from './Defaults.mjs';
import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

// OK, it seems that having an array of objects/players to draw is the way to keep track of them... A la https://medium.com/dailyjs/how-to-get-started-with-canvas-animations-in-javascript-cb2ccf37515c


//import { Server } from 'socket.io';
//const io = new Server(server)
// I need to figure out how to get access to the io stuff from server.js? Is that what I need to do. Feeling pretty helpless here.
const afterSlashBeforeDot = url => {
    var string = url.slice(0);
    while (string.indexOf("/") != -1) {
        string = string.slice(string.indexOf("/")+1)
    }

    return string.slice(0,string.indexOf("."));
}


const preloadImages = () => {
    const imagesArr = [];
    const preloadArr = [];
    const preloadDiv = document.getElementById("preload");
    
    imagesArr.push(Defaults.iconPlayerSelf);
    imagesArr.push(Defaults.iconPlayerOther);
    Defaults.iconCollectibleList.map(d => imagesArr.push(d));
    imagesArr.map((url, i) => {
        let id = afterSlashBeforeDot(url);
        var html = `<img id="${id}" style="visibility: hidden;" height=1 width=1 src="${url.slice(1)}"></img>`
        preloadDiv.insertAdjacentHTML("afterbegin",html);
    })
    
}
preloadImages();

const randInt = (max) => Math.floor(Math.random()*max)
const randXY = () => {
    var minLeft = Defaults.playBoxMarginSides;
    var maxRight = Defaults.width-Defaults.playBoxMarginSides-Defaults.sizePlayer;
    var rangeX = maxRight - minLeft;
    var minUp = Defaults.playBoxMarginTop;
    var maxDown = Defaults.height-Defaults.playBoxMarginBottom-Defaults.sizePlayer;
    var rangeY = maxDown - minUp;
    return [randInt(rangeX)+minLeft, randInt(rangeY)+minUp];
}
const generatePlayer = () => {
    var xy = randXY();
    var id = new Date().valueOf();
    var local = playerList.length == 0 ? true : false
    var playerObj = {x: xy[0], y: xy[1], score: 0, id: id, local: local};
    //console.log(`playerObj:`,playerObj);
    var player = new Player(playerObj);
    return player;
} 
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');
context.font = Defaults.font; // placing this here so it hopefully loads before the drawBoard call.
const playerList = [];
playerList.push(generatePlayer());
playerList.push(generatePlayer());
//var animate;
var gameOver = false;

const drawPlayer = (player) => {
    var id, image;
    if (player.local) { 
        id = afterSlashBeforeDot(Defaults.iconPlayerSelf);
    } else {
        id = afterSlashBeforeDot(Defaults.iconPlayerOther);
    }
    image = document.getElementById(id);
    context.drawImage(image, player.x, player.y, Defaults.sizePlayer, Defaults.sizePlayer);
}
// somehow the example can accept multiple inputs. how? is it establishing a while loop until the keyup event. OH, it is, it has to be. It would also create a smoother glide instead of waiting for the keydown event to repeat.

const drawBoard = () => {
    context.clearRect(0,0, Defaults.width,Defaults.height);
    context.fillStyle = Defaults.fill;
    //console.log(`context:`,context);
    context.fillRect(0, 0, Defaults.width, Defaults.height);
    context.strokeStyle = Defaults.stroke;
    context.strokeRect(Defaults.playBoxX,Defaults.playBoxY, Defaults.width-10, Defaults.height-35)
    context.fillStyle = Defaults.text;
    context.fillText("Controls: WASD", 7, 22, (Defaults.width/3)-7)
    playerList.forEach(player => {
        //console.log(`drawing player`, player)
        drawPlayer(player);
    })
    if (!gameOver) requestAnimationFrame(drawBoard);
}

var timers = {
    left: Number,
    up: Number,
    down: Number,
    right: Number
};


window.addEventListener('keydown', e => parseKey(e.key));
window.addEventListener('keyup', e => parseKey(e.key,true));

const moveUp = () => playerList[0].movePlayer("up");
const moveDown = () => playerList[0].movePlayer("down")
const moveLeft = () => playerList[0].movePlayer("left")
const moveRight = () => playerList[0].movePlayer("right")
const clearTimer = name => {
    clearInterval(timers[name])
    timers[name] = Number;
}

const parseKey = (key,keyup = false) => {
    switch(key) {
        case "W":
        case "w":
        case "ArrowUp":
            if (keyup == true) { 
                clearTimer("up")
                return null;
            } 
            if (isNaN(timers.up)) timers.up = setInterval(moveUp, Defaults.timerInterval);
            break;
        case "A":
        case "a":
        case "ArrowLeft":
            if (keyup == true) { 
                clearTimer("left")
                return null;
            } 
            if (isNaN(timers.left)) timers.left = setInterval(moveLeft, Defaults.timerInterval);
            break;
        case "S":
        case "s":
        case "ArrowDown":
            if (keyup == true) { 
                clearTimer("down")
                return null;
            } 
            if (isNaN(timers.down)) timers.down = setInterval(moveDown, Defaults.timerInterval);

            break;
        case "D":
        case "d":
        case "ArrowRight":
            if (keyup == true) { 
                clearTimer("right")
                return null;
            } 
            if (isNaN(timers.right)) timers.right = setInterval(moveRight, Defaults.timerInterval);
            break;
    }
}


//animate = requestAnimationFrame(drawBoard);
window.onload = e => {
    console.log(e);
    drawBoard();
}
