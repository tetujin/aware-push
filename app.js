// import libraries
const express = require('express');
var apn       = require('apn');
// var apn = require('@parse/node-apn');
var http      = require("request");
const uuidv1  = require('uuid/v1');

// generate an express instance
const app     = express();

// https://github.com/node-apn/node-apn/blob/master/doc/provider.markdown
var options = {
  token: {
    key: 'AuthKey_PFW9573J3A.p8', // Path to the key p8 file
    keyId: 'PFW9573J3A', // The Key ID of the p8 file (available at https://developer.apple.com/account/ios/certificate/key)
    teamId: 'FH352PYMNC', // The Team ID of your Apple Developer Account (available at https://developer.apple.com/account/#/membership/)
  },
  production: false,
};

// var options = {
//   token: {
//     key: 'AuthKey_89KQ3W4B27.p8', // Path to the key p8 file
//     keyId: '89KQ3W4B27', // The Key ID of the p8 file (available at https://developer.apple.com/account/ios/certificate/key)
//     teamId: 'FH352PYMNC', // The Team ID of your Apple Developer Account (available at https://developer.apple.com/account/#/membership/)
//   },
//   production: false,
// };


var apnProvider = new apn.Provider(options);
var token = "b24ace3c9906fb4fbb3de43f3b1a3155f649303b594dc74f91548228214e89f6";

app.get('/', (req, res) => {

  var note           = new apn.Notification();
  note.expiry = Math.floor(Date.now() / 1000) + 3600;
  note.payload = {
    'aware':[{'command':'restart'}]
  };
  // note.alert = {};
  //
  // settings for a background silent push notification
  // https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/sending_notification_requests_to_apns?language=objc
  // https://developer.apple.com/videos/play/wwdc2019/707/
  note.setContentAvailable(1);
  note.priority = 5;
  note.pushType = 'background';
  // note.pushType = 'alert';
  note.topic    = 'com.yuukinishiyama.app.aware-client-ios-v2'
  // note.topic    = 'com.yuukinishiyama.app.demo.Push2Me'
  // note.id = uuidv1();
  note.alert = {};

  console.log(note.compile());
  console.log(note.headers());
  //
  // console.log(`Sending: ${note.compile()} to ${token}`);

  apnProvider.send(note, [token]).then( (result) => {
  // see documentation for an explanation of result
    console.log(result)
  });

  res.json({"result":"200"});
});

app.listen(3000, '127.0.0.1');
console.log('start server');

function notify(){
  http.get({
    url: "http://127.0.0.1:3000",
  }, function(error, response, body){
    if (error != null) {
      console.log(error.response);
    }
  })
};

// setInterval(notify, 1000 * 60 * 30);
setTimeout(notify, 1000);
