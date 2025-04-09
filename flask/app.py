from flask import Flask, render_template, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

@app.route('/')
def index():

    return render_template('index.html')

@app.route('/api/data', methods=['GET'])
def api_data():

    name = request.args.get('name', 'Guest')

    data = {
        'message': f'Hello divyansh, {name} from Flask API!'
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
