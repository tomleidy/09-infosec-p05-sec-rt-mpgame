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
    playerSpeed: 1,
    iconPlayerSelf: "/icons/self/fairy.png",
    iconPlayerOther: "/icons/other/diamonds-smile.png",
    sizePlayer: 20,
    iconCollectibleList: [
        "/icons/collectibles/avocado.png",
        "/icons/collectibles/burn.png",
        "/icons/collectibles/cake-slice.png"],
    sizeCollectible:10
}

export default Defaults;

// I know why I'm having trouble focusing on doing anything that feels more  substantial than icon selection: I don't understand what I'm doing. Ugh. Socket.io, I lament in your direction.