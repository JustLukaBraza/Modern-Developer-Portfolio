from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_caching import Cache
from flask_compress import Compress
from flask_talisman import Talisman
from werkzeug.middleware.proxy_fix import ProxyFix
import os
import logging
from logging.handlers import RotatingFileHandler
from datetime import datetime
import json


app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app)


app.config.update(
    SECRET_KEY=os.environ.get('SECRET_KEY', 'your-secret-key-here'),
    SEND_FILE_MAX_AGE_DEFAULT=31536000,  
    MAX_CONTENT_LENGTH=16 * 1024 * 1024,  
    COMPRESS_ALGORITHM='gzip',
    COMPRESS_LEVEL=6,
    COMPRESS_MIN_SIZE=500,
    CACHE_TYPE='simple',
    CACHE_DEFAULT_TIMEOUT=300
)


cache = Cache(app)
Compress(app)
Talisman(app, 
    content_security_policy={
        'default-src': "'self'",
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdnjs.cloudflare.com", "https://kit.fontawesome.com"],
        'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com", "https://kit.fontawesome.com"],
        'font-src': ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "https://kit.fontawesome.com", "data:"],
        'img-src': ["'self'", "data:", "https:", "blob:"],
        'media-src': ["'self'", "data:", "blob:"],
        'connect-src': ["'self'", "https://formsubmit.co", "https://kit.fontawesome.com", "https://cdnjs.cloudflare.com"],
        'frame-ancestors': "'none'"
    }
)


if not os.path.exists('logs'):
    os.mkdir('logs')
file_handler = RotatingFileHandler('logs/portfolio.log', maxBytes=10240, backupCount=10)
file_handler.setFormatter(logging.Formatter(
    '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
))
file_handler.setLevel(logging.INFO)
app.logger.addHandler(file_handler)
app.logger.setLevel(logging.INFO)
app.logger.info('Portfolio startup')


def load_translations():
    try:
        with open('static/translations.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        app.logger.error(f'Error loading translations: {e}')
        return {}

translations = load_translations()


@app.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    app.logger.error(f'Server Error: {error}')
    return render_template('500.html'), 500

@app.errorhandler(413)
def too_large(e):
    return jsonify({'error': 'File too large'}), 413


@app.route('/')
@cache.cached(timeout=300)
def index():
    try:
        return render_template('index.html', translations=translations)
    except Exception as e:
        app.logger.error(f'Error rendering index: {e}')
        return render_template('500.html'), 500

@app.route('/static/<path:filename>')
@cache.cached(timeout=31536000)
def serve_static(filename):
    try:
        return send_from_directory('static', filename)
    except Exception as e:
        app.logger.error(f'Error serving static file {filename}: {e}')
        return '', 404

@app.route('/api/translations')
@cache.cached(timeout=3600)
def get_translations():
    try:
        return jsonify(translations)
    except Exception as e:
        app.logger.error(f'Error serving translations: {e}')
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0'
    })

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static/images'),
                             'favicon.svg', mimetype='image/svg+xml')


@app.route('/contact', methods=['POST'])
def contact():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        
        app.logger.info(f'Contact form submission from {data.get("email", "unknown")}')
        
        
        
        return jsonify({'message': 'Message sent successfully'}), 200
    except Exception as e:
        app.logger.error(f'Error processing contact form: {e}')
        return jsonify({'error': 'Internal server error'}), 500


@app.after_request
def add_header(response):
    if 'Cache-Control' not in response.headers:
        response.headers['Cache-Control'] = 'public, max-age=300'
    return response


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 