from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import timedelta

app = Flask(__name__)
print("Starting app.py...")

# Configuration
app.config['SECRET_KEY'] = 'your-super-secret-key-change-this-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///autonomeal.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your-jwt-secret-key-change-this-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

# Create database tables
with app.app_context():
    db.create_all()

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')

        # Validate input
        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400

        if len(username) < 4 or len(username) > 20:
            return jsonify({'error': 'Username must be between 4 and 20 characters'}), 400

        if len(password) < 8 or len(password) > 20:
            return jsonify({'error': 'Password must be between 8 and 20 characters'}), 400

        # Check if username already exists
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already exists'}), 409

        # Check if email already exists (if provided)
        if email and User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already exists'}), 409

        # Create new user
        password_hash = generate_password_hash(password)
        new_user = User(username=username, password_hash=password_hash, email=email)
        
        db.session.add(new_user)
        db.session.commit()

        # Generate JWT token
        access_token = create_access_token(identity=new_user.id)

        return jsonify({
            'success': True,
            'user': new_user.to_dict(),
            'token': access_token,
            'message': 'Registration successful'
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Registration error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        # Validate input
        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400

        if len(username) < 4 or len(username) > 20:
            return jsonify({'error': 'Username must be between 4 and 20 characters'}), 400

        if len(password) < 8 or len(password) > 20:
            return jsonify({'error': 'Password must be between 8 and 20 characters'}), 400

        # Find user
        user = User.query.filter_by(username=username).first()
        
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({'error': 'Invalid username or password'}), 401

        # Generate JWT token
        access_token = create_access_token(identity=user.id)

        return jsonify({
            'success': True,
            'user': user.to_dict(),
            'token': access_token,
            'message': 'Login successful'
        })

    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/protected/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({
            'success': True,
            'user': user.to_dict(),
            'message': 'Profile retrieved successfully'
        })

    except Exception as e:
        print(f"Profile error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Flask backend is running'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)