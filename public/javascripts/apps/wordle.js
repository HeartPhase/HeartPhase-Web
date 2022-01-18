let oReq, dataReq;
let app, loading, failed;
let words, results, filter;

window.onload = function () {
    oReq = new XMLHttpRequest();
    dataReq = new XMLHttpRequest();

    app = document.querySelector('.filter');
    loading = document.querySelector('.loading');
    failed = document.querySelector('.failed');

    pageOnLoad();
}


function pageOnLoad() {
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "wordle/cache");
    oReq.send();
    console.log('status request sent');
}

function reqListener() {
    const response = oReq.responseText;
    console.log('status request received: ' + response);

    if (response === '-1') {
        loading.attributes.setNamedItem(document.createAttribute('hidden'));
        failed.attributes.removeNamedItem('hidden');
    } else {
        dataReq.addEventListener("load", dataReqListener);
        dataReq.open("GET", "wordle/list");
        dataReq.send();
        console.log('data request sent');
    }
}

function dataReqListener() {
    const response = dataReq.responseText;
    console.log('data request received');
    words = response.split('|');
    loading.attributes.setNamedItem(document.createAttribute('hidden'));
    app.attributes.removeNamedItem('hidden');
    appStart();
}

function appStart() {
    console.log('app start');
    filter = ['[a-z]','[a-z]','[a-z]','[a-z]','[a-z]'];
    var count =  0;
    document.querySelectorAll('.letter').forEach(item => {
        item.index = count++;
        item.addEventListener('change', inputReceived, false);
    })
    results = document.querySelector('.results');
}

function inputReceived(e) {
    let index = e.target.index;
    let newValue = e.target.value;
    if (!newValue.match(/[a-zA-Z]/)) {
        e.target.value = '';
        return;
    }

    filter[index] = newValue.toLowerCase();
    let reg = new RegExp(filter.join(''));
    let filteredList = words.filter(word => word.match(reg));
    results.innerHTML = filteredList.join(',');
}

