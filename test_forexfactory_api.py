#!/usr/bin/env python3

import requests
import json
from datetime import datetime, timedelta

def test_forexfactory_api():
    """Test the ForexFactory calendar API to understand its response format"""
    
    # Calculate date range (today to 7 days ahead)
    today = datetime.now()
    date_from = today.strftime("%Y-%m-%d")
    date_to = (today + timedelta(days=7)).strftime("%Y-%m-%d")
    
    url = "https://www.forexfactory.com/calendar/apply-settings/1"
    
    headers = {
        "User-Agent": "market-calendar-tool (+https://github.com/pavelkrusek/market-calendar-tool)",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
    
    form_data = {
        "begin_date": date_from,
        "end_date": date_to,
    }
    
    print(f"Testing ForexFactory API...")
    print(f"Date range: {date_from} to {date_to}")
    print(f"URL: {url}")
    print(f"Payload: {json.dumps(form_data, indent=2)}")
    
    try:
        response = requests.post(url, json=form_data, headers=headers, timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                print(f"Response Type: {type(data)}")
                print(f"Response Keys: {list(data.keys()) if isinstance(data, dict) else 'Not a dict'}")
                
                # Save response to file for analysis
                with open('/workspace/forexfactory_response.json', 'w') as f:
                    json.dump(data, f, indent=2, default=str)
                print("Full response saved to: /workspace/forexfactory_response.json")
                
                # Show first few items for analysis
                if isinstance(data, list) and len(data) > 0:
                    print(f"Sample event (first item):")
                    print(json.dumps(data[0], indent=2, default=str))
                elif isinstance(data, dict):
                    print(f"Sample data:")
                    for key, value in list(data.items())[:5]:
                        print(f"  {key}: {value}")
                        
            except requests.exceptions.JSONDecodeError as e:
                print(f"JSON Decode Error: {e}")
                print(f"Raw response: {response.text[:1000]}...")
                
        else:
            print(f"Error Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"Request Error: {e}")

if __name__ == "__main__":
    test_forexfactory_api()
