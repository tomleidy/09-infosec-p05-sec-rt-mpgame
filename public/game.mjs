import {Defaults, playerBoxDefaults, collectibleBoxDefaults} from './Defaults.mjs';

import {randXYCollectible, randXYPlayer, generateCollectible, generatePlayer, playerList, afterSlashBeforeDot} from './generation.mjs'
import Player from './Player.mjs';
import {Collectible, collectibleList} from './Collectible.mjs';



//import { Server } from 'socket.io';
//const io = new Server(server)
// I need to figure out how to get access to the io stuff from server.js? Is that what I need to do. Feeling pretty helpless here.
// I need two versions of socket.io: client and server. The client will be mostly dealt with here, and the server will be in server. And getting EITHER of them to work seems untenable. Apparently, complaints about its documentation are common, and I am inclined to agree.

const imagesArr = [];
imagesArr.push(Defaults.iconPlayerSelf);
imagesArr.push(Defaults.iconPlayerOther);
Defaults.iconCollectibleList.map(d => imagesArr.push(d));

// "You win! Restart and try again."
// "You lose! Restart and try again."
// As I begin to look at socket.io, and how it was done in Advanced Node and Express server lessons, I am like... Hmm, I am going to need a different means of keeping track of which player is the local player. Aside from the local: variable. That timestamp fix probably helped.

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

if (typeof(document) == "object") {
// to avoid crashing the tests.
preloadImages();



canvas = document.getElementById('game-window');
context = canvas.getContext('2d');
context.font = Defaults.font; // placing this here so it hopefully loads before the drawBoard call.
playerList.push(generatePlayer());
playerList.push(generatePlayer());
console.log(playerList);

collectibleList.push(generateCollectible());
collectibleList.push(generateCollectible());
collectibleList.push(generateCollectible());
collectibleList.push(generateCollectible());
collectibleList.push(generateCollectible());
collectibleList.push(generateCollectible());
collectibleList.push(generateCollectible());
collectibleList.push(generateCollectible());
collectibleList.push(generateCollectible());
}
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


const drawBoard = () => {
    context.clearRect(0,0, Defaults.width,Defaults.height);
    context.fillStyle = Defaults.fill;
    //console.log(`context:`,context);
    context.fillRect(0, 0, Defaults.width, Defaults.height);
    context.strokeStyle = Defaults.stroke;
    context.strokeRect(Defaults.playBoxX,Defaults.playBoxY, Defaults.width-10, Defaults.height-35)
    context.fillStyle = Defaults.text;
    context.fillText("Controls: WASD", 7, 22, (Defaults.width/3)-7)
    context.fillText(playerList[0].calculateRank(playerList), Defaults.width*(2/3), 22, Defaults.width/3)
    playerList.forEach(player => {
        //console.log(`drawing player`, player)
        drawPlayer(player); // I'm wondering if I can move this to the Class in Player.mjs? It would be more organized...
        collectibleList.forEach(item => {
            if (player.collision(item) == true) {
                player.score+= item.value+1
                delete collectibleList[collectibleList.indexOf(item)]
                //console.log(`item.value, player.score:`,item.value,player.score)
            };
        }
        );
    })
    collectibleList.forEach(item => {
        item.draw();
    })
    if (!gameOver) requestAnimationFrame(drawBoard);

}

var timers = {
    left: Number,
    up: Number,
    down: Number,
    right: Number
};


if (typeof(window) == "object") {
window.addEventListener('keydown', e => parseKey(e.key));
window.addEventListener('keyup', e => parseKey(e.key,true));
}
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
        case "x":
            if (keyup==false){
                playerList[0].clearCount();
              //  console.log(`playerList:`,JSON.stringify(playerList));
            //    console.log(playerList.map(p => p.calculateRank(playerList)))
            }
            break;
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
if (typeof(window) == "object"){
    window.onload = e => {
        drawBoard();
        console.log(playerList);
    }
}
export default context;