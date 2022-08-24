const randInt = (max) => Math.floor(Math.random()*max)

const afterSlashBeforeDot = url => {
    var string = url.slice(0);
    while (string.indexOf("/") != -1) {
        string = string.slice(string.indexOf("/")+1)
    }
    return string.slice(0,string.indexOf("."));
}



export {randInt,afterSlashBeforeDot}