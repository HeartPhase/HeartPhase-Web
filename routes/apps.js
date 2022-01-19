var express = require('express');
var redis = require('redis');
var secret = require('./Secret')

var router = express.Router();
var client = redis.createClient({
    socket: {
        host: secret.redis_host,
        port: secret.redis_port
    },
    password: secret.redis_pwd
});

client.on('error', function (err) {
    console.log(err);
});

var words = -1;
var cached = false;

async function getListAsync() {
    console.log('getting word list from database');
    await client.connect();
    words = await client.get('WordleWords');
    console.log('got word list from database');
    cached = true;
    await client.disconnect();
};

const asyncCallWithTimeout = async (asyncPromise, timeout) => {
    let timeoutHandle;

    const timeoutPromise = new Promise((_resolve, reject) => {
        timeoutHandle = setTimeout(
            () => reject(new Error('Database connection timeout')), timeout
        );
    });
    return Promise.race([asyncPromise, timeoutPromise]).then(result => {
        clearTimeout(timeoutHandle);
        return result;
    });
};

router.get('/wordle/cache', async function (req, res) {
    if (words !== -1) res.send('0');
    else {
        try {
            await asyncCallWithTimeout(getListAsync(), 10000);
        } catch (e) {
            console.log(e);
        }
        if (cached) res.send('0');
        else res.send('-1');
    }
});

router.get('/wordle', function (req, res) {
    res.render('apps/wordle', {
        title: 'Wordle Helper',
    });
});

router.get('/wordle/list', function (req, res) {
    res.send(words.toString());
});

let excludes = [];

router.post('/wordle/exclude/:word', function (req, res) {
    excludes.push(req.params.word);
    // do sth to l1
    res.send('ok ok');
});

router.get('/wordle/exclude-list', function (req, res) {
    res.send(excludes.join('|'));
});

module.exports = router;
