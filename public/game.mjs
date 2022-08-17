import {Defaults, boxDefaults} from './Defaults.mjs';
import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

// OK, it seems that having an array of objects/players to draw is the way to keep track of them... A la https://medium.com/dailyjs/how-to-get-started-with-canvas-animations-in-javascript-cb2ccf37515c


console.log(`boxDefaults:`,boxDefaults);

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
const generatePlayer = (local = true) => {
    var xy = randXY();
    var id = new Date().valueOf();
    var playerObj = {x: xy[0], y: xy[1], score: 0, id: id, local: true};
    console.log(`playerObj:`,playerObj);
    var player = new Player(playerObj);
    return player;
} 
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');
context.font = Defaults.font; // placing this here so it hopefully loads before the drawBoard call.
const playerList = [];
playerList.push(generatePlayer()); // generate the information before we load.
var animate;
var gameOver = false;

const drawPlayer = (player) => {
    var id, image;
    if (player.local) { 
        id = afterSlashBeforeDot(Defaults.iconPlayerSelf);
    } else {
        id = afterSlashBeforeDot(Defaults.iconPlayerOther);
    }
    image = document.getElementById(id);
    console.log(context.drawImage(image, player.x, player.y, Defaults.sizePlayer, Defaults.sizePlayer));
}


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

window.addEventListener('keydown', e => parseKey(e.key, e));

const parseKey = (key, e) => {
    //console.log(e);
    var url = e.explicitOriginalTarget.ownerDocument
    switch(key) {
        case "W":
        case "w":
        case "ArrowUp":
            playerList[0].movePlayer("up");
            break;
        case "A":
        case "a":
        case "ArrowLeft":
            playerList[0].movePlayer("left");
            break;
        case "S":
        case "s":
        case "ArrowDown":
            playerList[0].movePlayer("down");
            break;
        case "D":
        case "d":
        case "ArrowRight":
            playerList[0].movePlayer("right");
            break;
        
    }
}


// Will I need to destroy the old drawing to move it? Figuring I'm going to end up with a trail of figures here when I finally get them to move.
// Suddenly worrying I'm going to need to re-render the entire board every time. We'll find out.
// The answer is yes, I will need to re-render the entire board with every update.
// Also margin detection is wonky. Shifted about 30 pixels too low on the y axis, and to the right by at least 10 on the x.
// Also my movement seems choppy and slow compared to the example.
// I think I'm done for today though.

animate = requestAnimationFrame(drawBoard);
window.onload = e => {
    console.log(e);
    drawBoard();
    //drawPlayer(playerList[0]);
//    drawPlayer(localPlayer, e.srcElement.URL)
}
