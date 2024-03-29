import { Defaults, playerBoxDefaults } from './Defaults.mjs';
import { afterSlashBeforeDot, randInt } from './generation.mjs'

var count = 100;

const randX = () => randInt(playerBoxDefaults.width) + Defaults.playBoxMarginSides
const randY = () => randInt(playerBoxDefaults.height) + Defaults.playBoxMarginTop

var localId;
var localPlayer;
var playerList = [];
count = 0;


class Player {
    constructor({ x = -1, y = -1, score = 0, id, local = false }) {
        this.x = x == -1 ? randX() : x;
        this.y = y == -1 ? randY() : y;
        this.score = score;
        this.id = id == -1 ? crypto.randomUUID() : id;
        this.local = this.id == localId ? true : local;
        this.tick = null;
        this.timers = { left: false, up: false, down: false, right: false }
        if (this.local == true) {
            localPlayer = this
            localId = this.id;
            playerList.push(this);
        }; 
        this.movePlayer = function (dir, speed = Defaults.speed) {
            var newPos;
            switch (dir) {
                case 'up':
                    newPos = this.y - speed;
                    if (newPos > playerBoxDefaults.minY) { // newPos needs to be GT minY
                        this.y = newPos;
                    } else {
                        this.y = playerBoxDefaults.minY + 1;
                    }
                    break;
                case 'down':
                    newPos = this.y + speed;
                    if (newPos < playerBoxDefaults.maxY) {
                        this.y = newPos;
                    } else {
                        this.y = playerBoxDefaults.maxY - 1;
                    }
                    break;
                case 'left':
                    newPos = this.x - speed;
                    if (newPos > playerBoxDefaults.minX) {
                        this.x = newPos;
                    } else {
                        this.x = playerBoxDefaults.minX + 1;
                    }
                    break;
                case 'right':
                    newPos = this.x + speed;
                    if (newPos < playerBoxDefaults.maxX) {
                        this.x = newPos;
                    } else {
                        this.x = playerBoxDefaults.maxX - 1;
                    }
            }
            return ({ x: this.x, y: this.y });
        }
        this.collision = function (item) {
            let pSize = Defaults.sizePlayer;
            let iSize = Defaults.sizeCollectible;
            if (pSize > iSize) { // player is bigger than collectible
                if (item.x > this.x && item.x < this.x + pSize && item.y > this.y && item.y < this.y + pSize) return true; // item UL corner
                if (item.x + iSize > this.x && item.x + iSize < this.x + pSize && item.y > this.y && item.y < this.y + pSize) return true; // item UR corner
                if (item.x > this.x && item.x < this.x + pSize && item.y + iSize > this.y && item.y < this.y + pSize) return true; // item LL corner
                if (item.x + iSize > this.x && item.x + iSize < this.x + pSize && item.y + iSize > this.y && item.y + iSize < this.y + pSize) return true;
            } else { // player is not bigger than collectible
                if (this.x + pSize > item.x && this.x + pSize < item.x + iSize && this.y > item.y && this.y < item.y + iSize) return true; // UR corner
                if (this.x > item.x && this.x < item.x + iSize && this.y > item.y && this.y < item.y + iSize) return true; // UL corner
                if (this.x > item.x && this.x < item.x + iSize && this.y + pSize > item.y && this.y + pSize < item.y + iSize) return true; // LL corner
                if (this.x + pSize > item.x && this.x + pSize < item.x + iSize && this.y + pSize > item.y && this.y + pSize < item.y + iSize) return true; // LR corner
                return false
            }
        }

        this.draw = function (context) {
            playerList.forEach(player => {
                var id, image;
                if (player.id == localId) {
                    id = afterSlashBeforeDot(Defaults.iconPlayerSelf);
                } else {
                    id = afterSlashBeforeDot(Defaults.iconPlayerOther);
                }
                image = document.getElementById(id);
                context.drawImage(image, player.x, player.y, Defaults.sizePlayer, Defaults.sizePlayer);
            })
        }
        this.setXY = function (x, y) {
            this.x = x;
            this.y = y;
        }
        this.getObj = function () { return Object({ x: this.x, y: this.y, id: this.id, score: this.score }) }
        this.calculateRank = function (arr = playerList) {
            var toSort = [...arr];
            var number = toSort.length;
            var sorted = toSort.sort((p1, p2) => {
                if (p1.score > p2.score) return -1;
                if (p1.score < p2.score) return 1;
                return 0;
            })
            var tempScore;
            sorted.find((e, i) => {
                if (e.id == this.id) tempScore = i + 1;
            })
            var string = `Rank: ${tempScore} / ${number}`
            return string;
        }

        this.timerTick = () => {
            Object.keys(this.timers).map(dir => {
                if (this.timers[dir] == true) this.movePlayer(dir);
            })
        }
        this.move = function (direction) {
            if (this.timers[direction] == false) {
                this.timers[direction] = true;
            }
            if (this.tick == null) this.tick = setInterval(this.timerTick, Defaults.timerInterval)
        }

        this.stop = function (direction) {
            this.timers[direction] = false;
            if (Object.values(this.timers).indexOf(true) == -1) {
                clearInterval(this.tick)
                this.tick = null;
            }
        }

        this.remoteMove = function (player, direction) {
            var index = playerList.findIndex(p => p.id == player.id)
            if (index == -1) return false;
            playerList[index].setXY(player.x, player.y);
            playerList[index].move(direction);
        }
        this.remoteStop = function (player, direction) {
            var index = playerList.findIndex(p => p.id == player.id)
            if (index == -1) return false;
            playerList[index].stop(direction);
            playerList[index].setXY(player.x, player.y);
        }
        this.addPlayer = (object) => playerList.push(new Player(object));
        this.delPlayer = id => playerList = playerList.filter(p => p.id != id);
        this.updateScore = (id, score) => {
            playerList.find(p => p.id == id).score = score
        }
        this.getList = function() { return playerList }
        this.updatePlayerList = arr => {
            // only to be called by socket.io
            playerList = arr.map(playerData => {
                if (playerData.id == localId) {
                    // update client score from server score, keep client x/y
                    localPlayer = new Player({
                        x: localPlayer.x,
                        y: localPlayer.y,
                        local: true,
                        ...playerData
                    })
    
                    return localPlayer;
                } else {
                    return new Player(playerData);
                }
            })
            return localPlayer
        }
        return this;
    }
}


const playerGenerate = () => {
    var x = randX();
    var y = randY();
    var id = crypto.randomUUID();
    var playerObj = { x: x, y: y, score: 0, id: id, local: true };
    var player = new Player(playerObj);
    localId = player.id;
    localPlayer = player;
    return player;
}




export default Player;
