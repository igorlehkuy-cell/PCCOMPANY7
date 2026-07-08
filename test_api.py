import urllib.request
import json

def login():
    req = urllib.request.Request('http://127.0.0.1:8000/api/login', data=b'username=admin@pccompany.com&password=admin123')
    res = urllib.request.urlopen(req)
    return json.loads(res.read())['access_token']

token = login()
headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

def create_product():
    data = json.dumps({'name': 'Test PC', 'price': 1000, 'category': 'ПК'}).encode('utf-8')
    req = urllib.request.Request('http://127.0.0.1:8000/api/products', data=data, headers=headers, method='POST')
    try:
        res = urllib.request.urlopen(req)
        print("Product Response:", res.status, res.read())
    except Exception as e:
        print("Product Error:", e.read())

def create_promo():
    data = json.dumps({'code': 'NEWTEST20', 'discount_percent': 20}).encode('utf-8')
    req = urllib.request.Request('http://127.0.0.1:8000/api/promocodes', data=data, headers=headers, method='POST')
    try:
        res = urllib.request.urlopen(req)
        print("Promo Response:", res.status, res.read())
    except Exception as e:
        print("Promo Error:", e.read())

create_product()
create_promo()
