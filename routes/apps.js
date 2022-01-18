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

client.on('error', function(err) {
  console.log(err);
});

var words = -1;

async function getListAsync() {
  console.log('getting word list from database');
  await client.connect();
  words = await client.get('WordleWords');
  console.log('got word list from database');
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
    console.log(result);
    return result;
  });
};

router.get('/wordle/cache', async function(req, res) {
  if (words !== -1) res.send('0');
  else {
    try {
      await asyncCallWithTimeout(getListAsync(), 10000);
    }
    catch (e) {
      console.log(e);
    }
    console.log(words);
    res.send('-1');
  }
});

router.get('/wordle',function(req, res) {
  res.render('apps/wordle', {
    title: 'Wordle Helper',
  });
});

router.get('/wordle/list', function(req, res) {
  res.send(words.toString());
})

router.get('/wordle/:l1-:l2-:l3-:l4-:l5', function(req, res) {
  var letter1 = req.params.l1;
  var letter2 = req.params.l2;
  var letter3 = req.params.l3;
  var letter4 = req.params.l4;
  var letter5 = req.params.l5;
  res.render('apps/wordle', {
    letter1 : letter1,
    letter2 : letter2,
    letter3 : letter3,
    letter4 : letter4,
    letter5 : letter5
  });
  //res.render(path.join('apps/', req.params[0]), { title: req.params[0]});
});

module.exports = router;
