let oReq, dataReq, exReq;
let app, loading, failed;

window.onload = function () {
    oReq = new XMLHttpRequest();
    dataReq = new XMLHttpRequest();
    exReq = new XMLHttpRequest();

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

let orders, buttons;
let words, results, filterCorrect, filterOther;

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
    let count =  0;
    filterCorrect = ['[a-z]','[a-z]','[a-z]','[a-z]','[a-z]'];
    filterOther = new Array(26).fill(0);
    orders = document.querySelectorAll('.order');
    orders.forEach(item => {
        item.index = count;
        item.addEventListener('change', orderReceived, false);
        count++;
    })

    count = 0;
    buttons = document.querySelectorAll('.letter');
    buttons.forEach(item => {
        item.index = count;
        item.addEventListener('click', inputReceived, false);
        item.innerHTML = String.fromCharCode(count + 97);
        count++;
    })
    results = document.querySelector('.results-list');
}

function orderReceived(e) {
    let index = e.target.index;
    let newValue = e.target.value;
    let cachedIndex = filterCorrect[index].charCodeAt(0) - 97;
    if (cachedIndex >= 0 && cachedIndex <= 25) {
        SetButtonAtIndexToState(cachedIndex, 0);
    }
    if (!newValue.match(/[a-zA-Z]/)) {
        e.target.value = '';
        filterCorrect[index] = '[a-z]';
        return;
    }
    newValue = newValue.toLowerCase();
    filterCorrect[index] = newValue;
    SetButtonAtIndexToState(newValue.charCodeAt(0) - 97, 81);

    GetResults();
}

function SetButtonAtIndexToState(index, state) {
    console.log(index + ' to '+ state);
    let targetButton = buttons[index];
    targetButton.classList.remove(classEnum[filterOther[index]]);
    filterOther[index] = state;
    targetButton.classList.add(classEnum[filterOther[index]]);
}

function inputReceived(e) {
    let index = e.target.index;
    if (filterOther[index] === 81) return;

    let limit = filterOther.filter(f => f === 1 | f === 81).length;
    e.target.classList.remove(classEnum[filterOther[index]]);
    if (limit >= 5 && filterOther[index] !== 1) filterOther[index] += 2;
    else filterOther[index]++;
    if (filterOther[index] >= 3) filterOther[index] = 0;
    e.target.classList.add(classEnum[filterOther[index]]);

    GetResults();
}

function GetResults() {
    // filter with correct characters
    let rx = new RegExp(filterCorrect.join(''));
    let filteredList = words.filter(w => w.match(rx));

    // filter with wrong position characters
    let filterContain = filterOther.map((state, i) => state === 1 ? i : -1).filter(i => i !== -1);
    filterContain.forEach(i => {
        let char = String.fromCharCode(i + 97);
        console.log('contain' + char);
        filteredList = filteredList.filter(w => w.includes(char));
    })

    let filterExclude = filterOther.map((state, i) => state === 2 ? i : -1).filter(i => i !== -1);
    filterExclude.forEach(i => {
        let char = String.fromCharCode(i + 97);
        console.log('exclude' + char);
        filteredList = filteredList.filter(w => !w.includes(char));
    })

    let resultsHtml = '';
    filteredList.forEach(w => {
        resultsHtml += '<li>' + w + '</li>';
    })
    results.innerHTML = resultsHtml;
}

function excludeOnClick(e) {
    exReq.open('POST', 'wordle/exclude/' + e, false);
    exReq.send();
}

let classEnum = {
    0: 'unknown',
    1: 'contain',
    2: 'exclude',
    81: 'correct'
}

