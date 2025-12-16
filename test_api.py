"""Quick test of the /api/react endpoint"""
import urllib.request
import json

url = "http://127.0.0.1:8000/api/react"

# Test a simple reaction
test_data = {
    "smarts": "[C:1]=[C:2].[Br:3][Br:4]>>[C:1]([Br:3])[C:2]([Br:4])",
    "reactants": ["C=C", "BrBr"]
}

print(f"Testing: {url}")
print(f"Payload: {json.dumps(test_data, indent=2)}")

try:
    data = json.dumps(test_data).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    response = urllib.request.urlopen(req, timeout=10)
    print(f"\nStatus: {response.status}")
    print(f"Response: {response.read().decode('utf-8')}")
except urllib.error.HTTPError as e:
    print(f"\nHTTP Error: {e.code}")
    print(f"Response: {e.read().decode('utf-8')}")
except Exception as e:
    print(f"Error: {e}")
