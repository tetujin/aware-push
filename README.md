# AWARE Push iOS

**AWARE Push iOS** is a Node.js based small service for communicating between AWAREFramework-iOS from a server-side through [Apple Push Notification services (APNs)](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/sending_notification_requests_to_apns/).


### Example
```
{
  "apn": {
    "category-available" : 1
  }
  "aware": {
    "v":1,
    "operations":[
      {"command":"stop"},
      {"command":"start"},
      {"command":"quit-study"},
      {"command":"restart-core"},
      {"command":"sync","target":"all"},
      {"command":"test","message":"hello"}
    ]
  }


```
