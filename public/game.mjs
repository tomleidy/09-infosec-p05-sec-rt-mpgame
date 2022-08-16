import Defaults from './Defaults.mjs'
import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
//import { parse } from 'dotenv/types/index.js';
// where did this line come from? was it part of my commit/sync? Probably.
// no idea, it's not in the git repository. SUSPICIOUS.


//import { Server } from 'socket.io';
//const io = new Server(server)
// I need to figure out how to get access to the io stuff from server.js? Is that what I need to do. Feeling pretty helpless here.

const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');


const drawBoard = (event) => {
    context.fillStyle = Defaults.fill;
    console.log(`context:`,context);
    context.fillRect(0, 0, Defaults.width, Defaults.height);
    context.strokeStyle = Defaults.stroke;
    context.strokeRect(Defaults.playBoxX,Defaults.playBoxY, Defaults.width-10, Defaults.height-35)
    context.font = Defaults.font;
    context.fillStyle = Defaults.text;
    context.fillText("Controls: WASD", 7, 22, (Defaults.width/3)-7)
}

// FINALLY I HAVE A CANVAS BOX. NOW TO GET THE STROKE BOX INSIDE..
// AWESOME I HAVE A THING THAT REPLICATES THE CONTROLS DISPLAY
// I just tested the example. The # of players will clip off the edge of the canvas if you have 10/10 as a rank.

window.addEventListener('keydown', e => parseKey(e.key.toLowerCase()));
// FINALLY THIS WORKS TOO.

const parseKey = key => {
    console.log(key)
    switch(key) {
        case "w":
        case "arrowup":
            Player.movePlayer("up",Defaults.speed)
            break;
        case "a":
        case "arrowleft":
            Player.movePlayer("left",Defaults.speed);
            break;
        case "s":
        case "arrowdown":
            Player.movePlayer("down",Defaults.speed);
            break;
        case "d":
        case "arrowright":
            Player.movePlayer("right",Defaults.speed);
            break;
    }
}
// It looks like I have the keyboard input working. Now I just need to figure out how to get the class method to work. Ugh.


//const drawPlayer = () => {}
// Will I need to destroy the old drawing to move it? Figuring I'm going to end up with a trail of figures here when I finally get them to move.


window.onload = e => {console.log(e); drawBoard(e);}

// Why is this not filling the rectangle, but if I put it in the CSS, it does it fine? Hmm.

