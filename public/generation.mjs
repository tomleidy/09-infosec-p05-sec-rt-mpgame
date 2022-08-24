import {Defaults} from './Defaults.mjs';

const randInt = (max) => Math.floor(Math.random()*max)

const afterSlashBeforeDot = url => {
    var string = url.slice(0);
    while (string.indexOf("/") != -1) {
        string = string.slice(string.indexOf("/")+1)
    }
    return string.slice(0,string.indexOf("."));
}


const imagesArr = [];
imagesArr.push(Defaults.iconPlayerSelf);
imagesArr.push(Defaults.iconPlayerOther);
Defaults.iconCollectibleList.map(d => imagesArr.push(d));

const preloadImages = () => {
    const preloadDiv = document.getElementById("preload");
    
    imagesArr.map((url, i) => {
        // I saw something that was like var img = new Image(); img.src = url but I got this to work before understanding that. That might be more optimal. I'll find out someday.
        let id = afterSlashBeforeDot(url);
        var html = `<img id="${id}" style="visibility: hidden;" height=1 width=1 src="${url.slice(1)}"></img>`
        preloadDiv.insertAdjacentHTML("afterbegin",html);
    })
    
}


export {randInt,afterSlashBeforeDot, preloadImages}