
from flask import Flask, request, jsonify
from flask_cors import CORS



app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'The server is running!!'

@app.route('/detect', methods=["POST"])
def testpost():
     data = request.get_json() 
     campaign_description = data.get('campaignDescription')
     print(type(campaign_description))

     if campaign_description=="This is my hate speech test":
         
         return 'Yes'
     else:
         return 'No'
          
if __name__ == '__main__':
    app.run()