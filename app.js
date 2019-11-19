// import libraries
const express = require('express');
var apn       = require('apn');
var config    = require('config');
const bodyParser = require('body-parser')

// generate an express instance
const app     = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var apnProvider = new apn.Provider(config.apn.options);

function getSilentPushNotificationContent(){
  var note           = new apn.Notification();
  note.expiry = Math.floor(Date.now() / 1000) + 3600;
  note.setContentAvailable(1);
  note.priority = 5;
  note.pushType = 'background';
  note.topic    = config.app.topic;
  note.alert    = {};
  return note;
}

function getPushNotificationContent(alert){
  var note           = new apn.Notification();
  note.expiry = Math.floor(Date.now() / 1000) + 3600;
  note.priority = 10;
  note.pushType = 'alert'
  note.topic    = config.app.topic;
  note.alert    = alert;
  return note;
}

function isValidAccount(id, key){
  config    = require('config');
  for (var i in config.users) {
    var user = config.users[i];
    if (key == user.key && id == user.id){
      return true;
    }
  }
  return false;
}

app.post('/silent', (req, res) => {
  var payload = req.body.payload;
  console.log(req.body);
  var tokens  = req.body.tokens;
  var key = req.body.key;
  var id  = req.body.id;
  if (isValidAccount(id, key)) {
    var note     = getSilentPushNotificationContent();
    note.payload = payload;
    apnProvider.send(note, tokens).then( (result) => {
      res.json({"result":200,"message":result});
    });
  }else{
    res.json({"result":400,"message":"No Authorized Key"});
  }
});

app.post('/alert', (req, res) => {
  var key = req.body.key;
  var id  = req.body.id;
  if (isValidAccount(id, key)) {
    var note = getPushNotificationContent(req.body.alert);
    apnProvider.send(note, req.body.tokens).then( (result) => {
      res.json({"result":200,"message":result});
    });
  }else{
    res.json({"result":400,"message":"No Authorized Key"});
  }
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
