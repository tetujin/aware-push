import urllib.request
import urllib.parse
import time
import json

def task():
    try:
        headers = {"Content-Type" : "application/json"}
        method  = "POST"
        tokens  = ["312b9f02837664b35858c965ddf7b7ef65a47ddc716916b30fd06673e2688453"]
        id  = "YOUR_ID"
        key = "YOUR_KEY"
        ops = [{"cmd":"reactivate-core"}]

        dict = {"payload":{"aware":{"v":1,"ops":ops}},"tokens":tokens,"id":id,"key":key}

        data = json.dumps(dict).encode('utf-8')
        request = urllib.request.Request('http://localhost:3000/silent', data=data, method=method, headers=headers)
        with urllib.request.urlopen(request) as response:
            response_body = response.read().decode("utf-8")
            print(response_body)
    except Exception as e:
        print(e)

while True:
    task()
    time.sleep(60*30)
    #time.sleep(10)
