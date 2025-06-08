from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import requests
import json
import os

app = Flask(__name__)
CORS(app)

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-pro')

# IPFS Configuration
PINATA_API_KEY = os.getenv("PINATA_API_KEY")
PINATA_SECRET = os.getenv("PINATA_SECRET")

def save_to_ipfs(conversation):
    url = "https://api.pinata.cloud/pinning/pinJSONToIPFS"
    headers = {
        "Content-Type": "application/json",
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET
    }
    try:
        response = requests.post(
            url,
            headers=headers,
            data=json.dumps({"pinataContent": conversation})
        )
        return response.json().get('IpfsHash') if response.status_code == 200 else None
    except Exception as e:
        return None

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')
    
    try:
        # Get Gemini response
        response = model.generate_content(user_message)
        bot_reply = response.text
        
        # Save conversation to IPFS (optional)
        # save_to_ipfs({"user": user_message, "bot": bot_reply})
        
        return jsonify({'reply': bot_reply})
    
    except Exception as e:
        return jsonify({'reply': "Sorry, I encountered an error"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
