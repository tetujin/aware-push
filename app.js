// import libraries
const express    = require('express');
var   config     = require('config');
const bodyParser = require('body-parser')
const pushNotifications = require('node-pushnotifications');

const push = new pushNotifications(config.push);

// generate an express instance
const app     = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// send a silent push notification
app.post('/silent', (req, res) => {
  var payload = req.body.payload;
  console.log(req.body);
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

// send an alert notification
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
