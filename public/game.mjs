import Defaults from './Defaults.mjs'
import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

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
        console.log(`id:`,id)
        var html = `<img id="${id}" style="visibility: hidden;" height=1 width=1 src="${url.slice(1)}"></img>`
        console.log(html);
        preloadDiv.insertAdjacentHTML("afterbegin",html);
    })
    
}
preloadImages();

const randInt = (max) => Math.floor(Math.random()*max)
const randXY = () => {
    var minLeft = Defaults.playBoxMarginSides;
    var maxRight = Defaults.width-Defaults.playBoxMarginSides;
    var rangeX = maxRight - minLeft;
    var minUp = Defaults.playBoxMarginTop;
    var maxDown = Defaults.height-Defaults.playBoxMarginBottom;
    var rangeY = maxDown - minUp;
    return [randInt(rangeX)+minLeft, randInt(rangeY)+minUp];
}
const generatePlayer = () => {
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

const localPlayer = generatePlayer(); // generate the information before we load.
const localId = localPlayer.id;

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

const drawBoard = (event) => {
    context.fillStyle = Defaults.fill;
    console.log(`context:`,context);
    context.fillRect(0, 0, Defaults.width, Defaults.height);
    context.strokeStyle = Defaults.stroke;
    context.strokeRect(Defaults.playBoxX,Defaults.playBoxY, Defaults.width-10, Defaults.height-35)
    context.fillStyle = Defaults.text;
    context.fillText("Controls: WASD", 7, 22, (Defaults.width/3)-7)
    drawPlayer(localPlayer);
}


window.addEventListener('keydown', e => parseKey(e.key, e));

const parseKey = (key, e) => {
    //console.log(e);
    var url = e.explicitOriginalTarget.ownerDocument
    switch(key) {
        case "W":
        case "w":
        case "ArrowUp":
            localPlayer.movePlayer("up",Defaults.speed)
            drawBoard(e);
            break;
        case "A":
        case "a":
        case "ArrowLeft":
            localPlayer.movePlayer("left",Defaults.speed);
            drawBoard(e);
            break;
        case "S":
        case "s":
        case "ArrowDown":
            localPlayer.movePlayer("down",Defaults.speed);
            drawBoard(e);
            break;
        case "D":
        case "d":
        case "ArrowRight":
            localPlayer.movePlayer("right",Defaults.speed);
            drawBoard(e);
            break;
        
    }
}


// Will I need to destroy the old drawing to move it? Figuring I'm going to end up with a trail of figures here when I finally get them to move.
// Suddenly worrying I'm going to need to re-render the entire board every time. We'll find out.

window.onload = e => {
    console.log(e);
    drawBoard(e);
    console.log(e);
//    drawPlayer(localPlayer, e.srcElement.URL)
}
