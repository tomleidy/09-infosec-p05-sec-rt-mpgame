import Defaults from './canvas-base.mjs'
import Player from './Player.mjs';
import Collectible from './Collectible.mjs';



//import { Server } from 'socket.io';
//const io = new Server(server)
// I need to figure out how to get access to the io stuff from server.js? Is that what I need to do. Feeling pretty helpless here.

const canvas = document.getElementById('game-window');
canvas.focus();
const context = canvas.getContext('2d');


const drawBoard = (event) => {
    context.fillStyle = Defaults.fill;
    console.log(`context:`,context);
    context.fillRect(0, 0, Defaults.width, Defaults.height);
    context.strokeStyle = Defaults.stroke;
    context.strokeRect(Defaults.playBoxX,Defaults.playBoxY, Defaults.width-10, Defaults.height-35)
    context.font = "13px 'Press Start 2P'"
    context.fillStyle = Defaults.text;
    context.fillText("Controls: WASD", 7, 22, (Defaults.width/3)-7)
}

// FINALLY I HAVE A CANVAS BOX. NOW TO GET THE STROKE BOX INSIDE..
// AWESOME I HAVE A THING THAT REPLICATES THE CONTROLS DISPLAY

window.addEventListener('keydown', e => console.log(e));
// FINALLY THIS WORKS TOO.
// w = 87, up arrow = 38
// asd = 65, 83, 68
// LDR = 37, 40, 39

window.onload = e => drawBoard(e);

// Why is this not filling the rectangle, but if I put it in the CSS, it does it fine? Hmm.

