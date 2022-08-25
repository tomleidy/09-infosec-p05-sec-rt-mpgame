//const url = require("socket.io-client/lib/url");

// we know the HTML says 640x480

const Defaults = {
    title: "Avocado Home",
    width: 640,
    height: 480,
    fill: "#222200",
    stroke: "#919180",
    font: '12px "Press Start 2P"',
    fontMedium: '14px "Press Start 2P"',
    fontLarge: '18px "Press Start 2P"',
    text: "white",
    playBoxX: 5,
    playBoxY: 30,
    playBoxMarginTop: 30,
    playBoxMarginBottom: 5,
    playBoxMarginSides: 5,
    speed: 5,
    iconPlayerSelf: "/public/icons/fairy.png",
    iconPlayerOther: "/public/icons/diamonds-smile.png",
    sizePlayer: 50,
    iconCollectibleList: [
        "/public/icons/family-house.png",
        "/public/icons/cake-slice.png",
        "/public/icons/avocado.png",
        "/public/icons/burn.png"
    ],
    sizeCollectible:34,
    timerInterval: 10,
    maxCollectibles: 3,
    gameOverScore: 50
}

const playBoxDefaults = {
    topMargin: Defaults.playBoxMarginTop,
    leftMargin: Defaults.playBoxMarginSides,
    rightMargin: Defaults.width-Defaults.playBoxMarginSides,
    bottomMargin: Defaults.height-Defaults.playBoxMarginBottom
}
const playerBoxDefaults = {
    minY: Defaults.playBoxMarginTop,
    maxY: Defaults.height-Defaults.playBoxMarginBottom-Defaults.sizePlayer,
    minX: Defaults.playBoxMarginSides,
    maxX: Defaults.width-Defaults.playBoxMarginSides-Defaults.sizePlayer,
    width: Defaults.width-(2*Defaults.playBoxMarginSides)-Defaults.sizePlayer,
    height: Defaults.height-Defaults.playBoxMarginBottom-Defaults.sizePlayer-Defaults.playBoxMarginTop
}

const collectibleBoxDefaults = {
    minY: Defaults.playBoxMarginTop,
    maxY: Defaults.height-Defaults.playBoxMarginBottom-Defaults.sizeCollectible,
    minX: Defaults.playBoxMarginSides,
    maxX: Defaults.width-Defaults.playBoxMarginSides-Defaults.sizeCollectible,
    width: Defaults.width-(2*Defaults.playBoxMarginSides)-Defaults.sizeCollectible,
    height: Defaults.height-Defaults.playBoxMarginBottom-Defaults.sizeCollectible-Defaults.playBoxMarginTop
}
  

export { Defaults, playerBoxDefaults, collectibleBoxDefaults };
