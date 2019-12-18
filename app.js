// import libraries
const express    = require('express');
var   config     = require('config');
const bodyParser = require('body-parser');

const pushNotifications = require('node-pushnotifications');
const push = new pushNotifications(config.push);

const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('aware-push.sqlite');
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS tokens (id INTEGER primary key, timestamp REAL NOT NULL, device_id TEXT NOT NULL, token TEXT NOT NULL, platform INTEGER NOT NULL DEFAULT 0)');
  // id, timestamp, device_id, token
});
// db.close();

// generate an express instance
const app     = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

/**
 send a silent push notification
 */
app.post('/silent', (req, res) => {
  var payload = req.body.payload;
  var tokens  = req.body.tokens;
  var key = req.body.key;
  var id  = req.body.id;

  if (isValidAccount(id, key)) {
    var data     = getSilentPushNotificationContent();
    data.payload = payload;
    push.send(tokens, data, (err, result) => {
      if (err) {
          res.json({"result":401,"message":err});
      } else {
          res.json({"result":200,"message":result});
      }
    });
  }else{
    res.json({"result":400,"message":"No Authorized Key"});
  }
});

/** send an alert notification */
app.post('/alert', (req, res) => {
  var key = req.body.key;
  var id  = req.body.id;
  var tokens = req.body.tokens;

  if (isValidAccount(id, key)) {
    var data = getPushNotificationContent(req.body.alert);
    push.send(tokens, data, (err, result) => {
      if (err) {
          console.log(err);
          res.json({"result":401,"message":err});
      } else {
          console.log(result);
          res.json({"result":200,"message":result});
      }
    });
  }else{
    res.json({"result":400,"message":"No Authorized Key"});
  }
});

app.post('/token/register', (req, res) => {
    db.serialize(() => {
        var token     = req.body.token;
        var device_id = req.body.device_id;
        var platform  = req.body.platform; // 0:unknown, 1:iOS, 2:Android

        if (token == null || token == undefined) {
          res.json({"result":400,"message":"`token` is null"});
        }

        if (device_id == null || device_id == undefined) {
          res.json({"result":400,"message":"`device_id` is null"});
        }

        if (platform == null || platform == undefined) {
          platform = 0;
        }

        deleteToken(device_id,token);
        var result = insertToken(device_id, token, platform);
        if(result.status){
          res.json({"result":200,"message":"registered"});
        }else{
          res.json({"result":500,"message":result.error});
        }
    });
});

app.post('/token/unregister', (req, res) => {
  var token     = req.body.token;
  var device_id = req.body.device_id;

  if (token == null || token == undefined) {
    res.json({"result":400,"message":"`token` is null"});
  }

  if (device_id == null || device_id == undefined) {
    res.json({"result":400,"message":"`device_id` is null"});
  }

  deleteToken(device_id,token);
  res.json({"result":200,"message":"unregistered"});
});

// start an aware-push server
app.listen(3000, '127.0.0.1');
console.log('start server: http://127.0.0.1:3000');


/////////////////  addition functions ///////////////////
// var apnProvider = new apn.Provider(config.apn.options);
function getSilentPushNotificationContent(){
  const data = {
    expiry:Math.floor(Date.now() / 1000) + 3600 ,
    contentAvailable:true,
    priority:'normal',
    pushType:'background',
    topic:config.app.topic,
    alert:{}
  };
  return data;
}

function getPushNotificationContent(alert){
  const data = {
    expiry:Math.floor(Date.now() / 1000) + 3600 ,
    contentAvailable:true,
    priority:'high',
    pushType:'alert',
    topic:config.app.topic,
    alert:alert
  };
  return data;
}

function deleteToken(device_id, token){
  db.serialize(() => {
    try {
      db.run(`delete from tokens where device_id = $device_id`, device_id);
    } catch (e) {
      console.log(e);
    } finally {
      return;
    }
  });
}

function insertToken(device_id, token, platform){
  var date = new Date() ;
  var timestamp = date.getTime();

  try {
    const stmt = db.prepare('INSERT INTO tokens (timestamp, device_id, token, platform) values (?, ?, ?, ?)');
    stmt.run([timestamp, device_id, token, platform]);
    stmt.finalize();
    return {'status':true, 'error':null};
  } catch (e) {
    return {'status':false, 'error':e};
  }
}

// notify
function notify(){
  db.serialize(() => {
    db.all('SELECT token FROM tokens', function(err, rows) {
      var data     = getSilentPushNotificationContent();
      var tokens = [];
      for (row of rows) {
        tokens.push(row.token);
      }

      data.payload = {"aware":{
                        "v":1,
                        "ops":[
                          {"cmd":"reactivate-core"}
                        ]}
                      };
      push.send(tokens, data, (err, result) => {
          console.log(result, err);
      });
    });
  });
};

// setInterval(notify, 1000 * 10);// * 60); // * 30);
setTimeout(notify, 1000);
