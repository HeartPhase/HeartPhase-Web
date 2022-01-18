document.querySelector('#container').addEventListener(onload, pageOnLoad);
var oReq = new XMLHttpRequest();

function pageOnLoad() {
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "cache");
    oReq.send();
}

function reqListener() {
    var response = oReq.responseText;
}