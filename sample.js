// import libraries
const express = require('express');
var apn       = require('apn');
var http      = require("request");
const uuidv1  = require('uuid/v1');
var mysql     = require('mysql');
var config    = require('config');

// generate an express instance
const app     = express();
app.set('view engine', 'pug')

var apnProvider = new apn.Provider(config.apn.options);

function getSilentPushNotificationContent(){
  var note           = new apn.Notification();
  note.expiry = Math.floor(Date.now() / 1000) + 3600;
  note.setContentAvailable(1);
  note.priority = 5;
  note.pushType = 'background'; //'alert'
  note.topic    = config.app.topic;
  note.alert    = {};
  return note;
}

function getPushNotificationContent(){
  var note           = new apn.Notification();
  note.expiry = Math.floor(Date.now() / 1000) + 3600;
  note.priority = 10;
  note.pushType = 'alert'
  note.topic    = config.app.topic;
  return note;
}

function sendNotificationToAll(notificationContent){
  var connection = mysql.createConnection(config.db);

  var query = 'select token from (select * from push_notification_device_tokens order by timestamp desc) as tokens group by device_id';
  connection.query(query, function (error, results, fields) {
    var tokens = []
    for (var i in results) {
      tokens.push(results[i].token);
    }
    apnProvider.send(notificationContent, tokens).then( (result) => {
      console.log(result)
    });
  })
}

app.get('/', (req, res) => {
  res.render('index')
});

app.get('/start-all-sensors', (req, res) => {
  var note = getSilentPushNotificationContent();
  note.payload = {
    'aware':{
        v:1,
        ops:[{"cmd":"start-all-sensors"}]
    }
  };
  sendNotificationToAll(note);
  res.json({"result":"200"});
});

app.get('/stop-all-sensors', (req, res) => {
  var note = getSilentPushNotificationContent();
  note.payload = {
    'aware':{
        v:1,
        ops:[{"cmd":"stop-all-sensors"}]
    }
  };
  sendNotificationToAll(note);
  res.json({"result":"200"});
});

app.get('/sync-all-sensors', (req, res) => {
  var note = getSilentPushNotificationContent();
  note.payload = {
    'aware':{
        v:1,
        ops:[{"cmd":"sync-all-sensors"}]
    }
  };
  sendNotificationToAll(note);
  res.json({"result":"200"});
});

app.get('/reactivate-core', (req, res) => {
  var note = getSilentPushNotificationContent();
  note.payload = {
    'aware':{
        v:1,
        ops:[{"cmd":"reactivate-core"}]
    }
  };
  sendNotificationToAll(note);
  res.json({"result":"200"});
});

app.get('/push-msg', (req, res) => {
  var note = getSilentPushNotificationContent();
  note.payload = {
    'aware':{
        v:1,
        ops:[{"cmd":"push-msg","msg":{"title":"test"}}]
    }
  };
  sendNotificationToAll(note);
  res.json({"result":"200"});
});

app.get('/sync-config', (req, res) => {
  var note = getSilentPushNotificationContent();
  note.payload = {
    'aware':{
        v:1,
        ops:[{'cmd':'sync-config'}]
    }
  };
  sendNotificationToAll(note);
  res.json({"result":"200"});
});

app.listen(3000, '127.0.0.1');
console.log('start server: http://127.0.0.1:3000');

// notify
// function notify(){
//   http.get({
//     url: "http://127.0.0.1:3000",
//   }, function(error, response, body){
//     if (error != null) {
//       console.log(error.response);
//     }
//   })
// };

// setInterval(notify, 1000 * 10);// * 60); // * 30);
// setTimeout(notify, 1000);
