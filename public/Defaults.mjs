//const url = require("socket.io-client/lib/url");

// we know the HTML says 640x480

const Defaults = {
    width: 640,
    height: 480,
    fill: "#222200",
    stroke: "#919180",
    font: '13px "Press Start 2P"',
    text: "white",
    playBoxX: 5,
    playBoxY: 30,
    playBoxMarginTop: 30,
    playBoxMarginBottom: 5,
    playBoxMarginSides: 5,
    speed: 10,
    iconPlayerSelf: "/icons/fairy.png",
    iconPlayerOther: "/icons/diamonds-smile.png",
    sizePlayer: 50,
    iconCollectibleList: [
        "/icons/avocado.png",
        "/icons/burn.png",
        "/icons/cake-slice.png"],
    sizeCollectible:10
}

const boxDefaults = {
    topMargin: Defaults.playBoxMarginTop,
    leftMargin: Defaults.playBoxMarginSides,
    rightMargin: Defaults.width-Defaults.playBoxMarginSides,
    bottomMargin: Defaults.height-Defaults.playBoxMarginBottom,
    playerMinY: Defaults.playBoxMarginTop+1,
    playerMaxY: Defaults.height-Defaults.playBoxMarginBottom-Defaults.sizePlayer,
    playerMinX: Defaults.playBoxMarginSides,
    playerMaxX: Defaults.width-Defaults.playBoxMarginSides-Defaults.sizePlayer
  }
  

export { Defaults, boxDefaults };

// I know why I'm having trouble focusing on doing anything that feels more  substantial than icon selection: I don't understand what I'm doing. Ugh. Socket.io, I lament in your direction.