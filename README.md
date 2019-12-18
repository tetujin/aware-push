# AWARE Push iOS

**AWARE Push iOS** is a Node.js based small service for communicating between AWAREFramework-iOS from a server-side through [Apple Push Notification services (APNs)](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/sending_notification_requests_to_apns/).

## How to use

1. Setup Node.js
Setup Node.js packages
`npm install`

2. Getting a certification for push notification

3. Edit configurations for Node.js
Please rename `config/sample.json` to `config/default.json`, and fill out the configurations for connecting AWARE and APN-server.

4. Run aware-push-ios
```
node app.js
```

5. Test

**Normal Push Notification**
```
curl -X POST -H "Content-Type: application/json" -d '{"alert":{"title":"TITLE","body":"BODY"},"tokens":["TOKEN"],"id":"YOUR_ID","key":"YOUR_KEY"}' http://127.0.0.1:3000/alert
```

**Silent Push Notification**
```
curl -X POST -H "Content-Type: application/json" -d '{"payload":{"aware":{"v":1,"ops":[{"cmd":"start-all-sensors"}]}},"tokens":["TOKEN"],"id":"YOUR_ID","key":"YOUR_KEY"}' http://127.0.0.1:3000/silent
```

**Continuation Silent Push Notification**
```
curl -X POST -H "Content-Type: application/json" -d '{"token":"TOKEN","device_id":"DEVICE_ID","platform":1}' http://127.0.0.1:3000/token/register
```
platform (0=Unknown, 1=iOS, 2=Android)

### Push Notification (Alert)

```
{
  "alert":{
    "title":"TITLE",
    "body":"BODY"
  },
  "tokens":[
    "TOKEN"
  ],
  "id":"HOGE_ID",
  "key":"HOGE_KEY"
}
```

### Silent Push Notification

```
{
  "payload":{
    "aware":{
      "v":1,
      "ops":[
        {"cmd":"reactivate-core"}
      ]
    }
  },
  "tokens":["TOKEN"],
  "id":"HOGE_ID",
  "key":"HOGE_KEY"
}
```

You can insert the following commands if you need.
* {"cmd":"start-all-sensors"}
* {"cmd":"stop-all-sensors"}
* {"cmd":"sync-all-sensors"}
* {"cmd":"sync-sensor","targets":["accelerometer"]}
* {"cmd":"reactivate-core"}
* {"cmd":"push-msg","msg":{"title":"","body":""}}
