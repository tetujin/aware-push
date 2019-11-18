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

## Example

### Push Notification (Alert)

```
note.priority = 10;
note.pushType = 'alert';
note.topic    = 'your.bundle.identifier'
note.alert    = "Hello World!";
```

### Silent Push Notification

```
note.setContentAvailable(1);
note.priority = 5;
note.pushType = 'background';
note.topic    = 'your.bundle.identifier'
note.payload  = {
  aware:{
      v:1.0,
      ops:[{'cmd':'sync-config'}]
  }
};
```

```
{
  "apn": {
    "category-available" : 1
  }
  "aware": {
    "v":1.0,
    "ops":[
      {"cmd":"sync-config"}
    ]
  }
}
```

You can insert the following commands if you need.
* {"cmd":"start-all-sensors"}
* {"cmd":"stop-all-sensors"}
* {"cmd":"sync-all-sensors"}
* {"cmd":"sync-sensor","targets":["accelerometer"]}
* {"cmd":"reactivate-core"}
* {"cmd":"push-msg","msg":{"title":"","body":""}}
