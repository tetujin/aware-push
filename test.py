import urllib.request
import urllib.parse
import time
import json

def content(testId, testKey):
    tokens  = ["312b9f02837664b35858c965ddf7b7ef65a47ddc716916b30fd06673e2688453"]#["A_TOKEN"]
    id  = "YOUR_ID"
    if testId:
        id = testId
    key = "YOUR_KEY"
    if testKey:
        key = testKey
    ops = [{"cmd":"reactivate-core"}]
    dict = {"payload":{"aware":{"v":1,"ops":ops}},"tokens":tokens,"id":id,"key":key}
    return dict

def testQuery(url, method, headers, content):
    data = json.dumps(content).encode('utf-8')
    request = urllib.request.Request(url, data=data, method=method, headers=headers)
    with urllib.request.urlopen(request) as response:
        response_body = response.read().decode("utf-8")
        print(response_body)


testQuery('http://localhost:3000/silent', "POST", {"Content-Type" : "application/json"}, content(None, None))

alert_con = content(None, None)
alert_con["alert"] = "Hello World!"
testQuery('http://localhost:3000/alert', "POST", {"Content-Type" : "application/json"}, alert_con);

testQuery('http://localhost:3000/silent', "POST", {"Content-Type" : "application/json"}, content("HOGE", "HOGE"))

alert_con = content("HOGE", "HOGE")
alert_con["alert"] = "Hello World!"
testQuery('http://localhost:3000/alert', "POST", {"Content-Type" : "application/json"}, alert_con);


token = {"device_id":"abcde","token":"12345","platform":1}
testQuery('http://localhost:3000/token/register', "POST", {"Content-Type" : "application/json"},token)
testQuery('http://localhost:3000/token/unregister', "POST", {"Content-Type" : "application/json"},token)
