from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/contact', methods=['POST'])
def contact():
    data = request.form
    
    return jsonify({'status': 'success', 'message': 'Message sent successfully!'})

if __name__ == '__main__':
    app.run(debug=True) 