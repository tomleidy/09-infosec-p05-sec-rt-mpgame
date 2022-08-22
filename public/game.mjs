import {Defaults, playerBoxDefaults, collectibleBoxDefaults} from './Defaults.mjs';

import {generatePlayer, playerList, afterSlashBeforeDot} from './generation.mjs'
import Player from './Player.mjs';
import {Collectible, collectibleList} from './Collectible.mjs';

const socket = io();
console.log(socket.id)

var connection = undefined;
socket.on("connect", () => {
    console.log(socket)
})
console.log(socket.id);

const imagesArr = [];
imagesArr.push(Defaults.iconPlayerSelf);
imagesArr.push(Defaults.iconPlayerOther);
Defaults.iconCollectibleList.map(d => imagesArr.push(d));

// "You win! Restart and try again."
// "You lose! Restart and try again."

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
console.log(localPlayer);


if (typeof(document) == "object") {
    // to avoid crashing the tests.
    preloadImages();
    canvas = document.getElementById('game-window');
    context = canvas.getContext('2d');
    context.font = Defaults.font; 
    // placing this here so it hopefully loads before the drawBoard call.
    playerList.push(localPlayer);
}

if (typeof(window) == "object") {
    window.addEventListener('keydown', e => parseKey(e.key));
    window.addEventListener('keyup', e => parseKey(e.key,true));
}
var gameOver = false;

const emitCollision = (player, item) => {
    // this could and should be moved to the Player class, IMO.
    // as it is, it's in the drawBoard function right now.
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
    
    text = playerList[0].calculateRank(playerList);
    textWidth = context.measureText(text).width;
    context.fillStyle = Defaults.fontMedium;
    textWidth = context.measureText(Defaults.title).width;
    context.fillText(Defaults.title, (Defaults.width-textWidth)/2, 22, Defaults.width*(2/3))
    context.fillText(text, Defaults.width-(textWidth+7), 22, Defaults.width/3)
    playerList.forEach(player => {
        player.draw(context);
        collectibleList.forEach(item => {
            if (player.collision(item) == true) {
                player.score+= item.value+1
                if (socket.id != undefined) {
                    collisionObj = {player: player.id, item: item.id, value: item.value}
                    console.log(collisionObj);
                    socket.emit("collision",collisionObj)
                } else {
                    console.log("no connection, the cake is a lie")
                }
                item.delete(); // we'll be changing this when the server is keeping track of items.
            };
        });
    })
    Collectible.populate();
    collectibleList.forEach(item => {
        item.draw();
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

var timers = {
    left: Number,
    up: Number,
    down: Number,
    right: Number
};



const moveUp = () => playerList[0].movePlayer("up");
const moveDown = () => playerList[0].movePlayer("down")
const moveLeft = () => playerList[0].movePlayer("left")
const moveRight = () => playerList[0].movePlayer("right")
const clearTimer = name => {
    clearInterval(timers[name])
    timers[name] = Number;
}


const parseKey = (key,keyup = false) => {
    // this could be tidied up. the move functiosn could be called with the argument direction. and the keyup if could be done once before the switch. so two switch statements. keyDirection = key returns up/down/left/right. if keyup, clear direction. if keydown, movedirection. I think I need to put ... Oh, the timer can do a similar thing as the clearTimer function with the direction as an argument.
    switch(key) {
        case "x":
            if (keyup==false){
                playerList[0].clearCount();
            }
            break;
        case "o":
            if (keyup==false) gameOver = "win";
            break;
        case "p":
            if (keyup==false) gameOver = "lose";
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
    }
    window.onbeforeunload = e => {
        socket.disconnect();
    }

}
export default context;