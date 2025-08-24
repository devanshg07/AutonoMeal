
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
from PIL import Image
from io import BytesIO
import base64
import requests
import openai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# -------------------------
# Flask App Setup
# -------------------------
app = Flask(__name__)

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

# -------------------------
# API Keys
# -------------------------
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
IMGBB_API_KEY = os.getenv("IMGBB_API_KEY")
STABILITY_API_KEY = os.getenv("STABILITY_API_KEY")
openai.api_key = OPENAI_API_KEY

# -------------------------
# User Model
# -------------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    experience = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'experience': self.experience,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

with app.app_context():
    db.create_all()

# -------------------------
# Auth Endpoints
# -------------------------
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')

        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400
        if len(username) < 4 or len(username) > 20:
            return jsonify({'error': 'Username must be between 4 and 20 characters'}), 400
        if len(password) < 8 or len(password) > 20:
            return jsonify({'error': 'Password must be between 8 and 20 characters'}), 400

        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already exists'}), 409
        if email and User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already exists'}), 409

        password_hash = generate_password_hash(password)
        new_user = User(username=username, password_hash=password_hash, email=email)

        db.session.add(new_user)
        db.session.commit()

        access_token = create_access_token(identity=new_user.id)
        return jsonify({'success': True, 'user': new_user.to_dict(), 'token': access_token, 'message': 'Registration successful'}), 201

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

        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400

        user = User.query.filter_by(username=username).first()
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({'error': 'Invalid username or password'}), 401

        access_token = create_access_token(identity=user.id)
        return jsonify({'success': True, 'user': user.to_dict(), 'token': access_token, 'message': 'Login successful'})

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
        return jsonify({'success': True, 'user': user.to_dict(), 'message': 'Profile retrieved successfully'})
    except Exception as e:
        print(f"Profile error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

# -------------------------
# Experience Endpoints
# -------------------------
@app.route('/api/experience/add', methods=['POST'])
@jwt_required()
def add_experience():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        data = request.get_json()
        experience_points = data.get('points', 50)
        user.experience += experience_points
        db.session.commit()

        return jsonify({'success': True, 'experience': user.experience, 'points_added': experience_points, 'message': f'Added {experience_points} experience points!'})
    except Exception as e:
        db.session.rollback()
        print(f"Error adding experience: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/experience/get', methods=['GET'])
@jwt_required()
def get_experience():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({'success': True, 'experience': user.experience, 'level': (user.experience // 1000) + 1, 'progress_to_next': user.experience % 1000})
    except Exception as e:
        print(f"Error getting experience: {e}")
        return jsonify({'error': 'Internal server error'}), 500

# -------------------------
# AI + Image Functions
# -------------------------
def upload_to_imgbb(image_path):
    with open(image_path, "rb") as f:
        encoded_image = base64.b64encode(f.read())
    url = "https://api.imgbb.com/1/upload"
    payload = {"key": IMGBB_API_KEY, "image": encoded_image}
    response = requests.post(url, data=payload)
    response.raise_for_status()
    return response.json()["data"]["url"]

def analyze_image(image_url):
    response = openai.ChatCompletion.create(
        model="gpt-4-vision-preview",
        messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": "Give me a star rating out of 10. Describe this image in detail and give me an explanation (2-3 sentences)."},
                {"type": "image_url", "image_url": {"url": image_url}}
            ]
        }]
    )
    return response.choices[0].message.content

def generate_recipe_with_preferences(preferences):
    """Generate a recipe based on user preferences"""
    try:
        # Build the prompt based on user preferences
        prompt = f"""
        Generate a detailed recipe that considers the following user preferences:
        
        Food Preferences: {', '.join(preferences.get('cuisines', []))}
        Dietary Restrictions: {', '.join(preferences.get('restrictions', []))}
        Missing Ingredients (don't use these): {', '.join(preferences.get('missingIngredients', []))}
        Cooking Experience: {', '.join(preferences.get('cookingExperience', []))}
        
        Please provide a recipe in the following JSON format:
        {{
            "title": "Recipe Title",
            "description": "Brief description of the dish",
            "difficulty": "Beginner/Intermediate/Advanced",
            "cookTime": "XX min",
            "rating": 4.5,
            "ingredients": ["ingredient 1", "ingredient 2", ...],
            "steps": ["step 1", "step 2", ...]
        }}
        
        Make sure the recipe:
        1. Uses ingredients from the preferred cuisines
        2. Respects all dietary restrictions
        3. Avoids missing ingredients
        4. Matches the user's cooking experience level
        5. Is realistic and achievable
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        
        # Try to parse JSON response
        try:
            import json
            recipe_text = response.choices[0].message.content
            # Extract JSON from the response
            start_idx = recipe_text.find('{')
            end_idx = recipe_text.rfind('}') + 1
            json_str = recipe_text[start_idx:end_idx]
            recipe_data = json.loads(json_str)
            return recipe_data
        except:
            # Fallback if JSON parsing fails
            return {
                "title": "Custom Recipe",
                "description": "A personalized recipe based on your preferences",
                "difficulty": "Intermediate",
                "cookTime": "30 min",
                "rating": 4.5,
                "ingredients": ["Custom ingredients based on preferences"],
                "steps": ["Custom steps based on preferences"]
            }
            
    except Exception as e:
        print(f"Error generating recipe: {e}")
        return {
            "title": "Error Recipe",
            "description": "Could not generate recipe",
            "difficulty": "Beginner",
            "cookTime": "20 min",
            "rating": 4.0,
            "ingredients": ["Basic ingredients"],
            "steps": ["Basic steps"]
        }

def generate_dish_image(dish_name):
    """Generate an image of the dish using Stability AI"""
    try:
        url = "https://api.stability.ai/v2beta/stable-image/generate/core"
        headers = {"Authorization": f"Bearer {STABILITY_API_KEY}", "Accept": "application/json"}
        payload = {
            "prompt": f"A realistic photograph of {dish_name}, plated at home, slightly imperfect but appetizing.",
            "output_format": "png",
            "aspect_ratio": "1:1"
        }
        response = requests.post(url, headers=headers, files={"none": ""}, data=payload)
        response.raise_for_status()
        data = response.json()
        
        if "image" in data:
            image_b64 = data["image"]
            image_bytes = base64.b64decode(image_b64)
            img = Image.open(BytesIO(image_bytes))
            img.save("dish.png")
            return "dish.png"
        else:
            raise ValueError(f"Unexpected response format: {data}")
    except Exception as e:
        print(f"Error generating dish image: {e}")
        return None

# -------------------------
# AI Recipe Generation Endpoint
# -------------------------
@app.route('/api/generate-recipe', methods=['POST'])
@jwt_required()
def generate_ai_recipe():
    try:
        data = request.get_json()
        preferences = data.get('preferences', {})
        
        # Generate recipe based on preferences
        recipe = generate_recipe_with_preferences(preferences)
        
        # Generate image for the dish
        dish_name = recipe.get('title', 'Custom Dish')
        image_path = generate_dish_image(dish_name)
        
        # Upload image to ImgBB if generated successfully
        image_url = None
        if image_path:
            try:
                image_url = upload_to_imgbb(image_path)
            except Exception as e:
                print(f"Error uploading image: {e}")
                image_url = "https://via.placeholder.com/400x300?text=Recipe+Image"
        
        # Add unique ID and image URL to recipe
        import uuid
        recipe['id'] = str(uuid.uuid4())
        recipe['image'] = image_url or "https://via.placeholder.com/400x300?text=Recipe+Image"
        
        return jsonify({
            'success': True,
            'recipe': recipe,
            'message': 'Recipe generated successfully!'
        })
        
    except Exception as e:
        print(f"Error generating AI recipe: {e}")
        return jsonify({'error': 'Failed to generate recipe'}), 500

# -------------------------
# Image Analysis Endpoint
# -------------------------
@app.route('/api/analyze-image', methods=['POST'])
def api_analyze_image():
    try:
        file = request.files.get('image')
        if not file:
            return jsonify({'error': 'No image uploaded'}), 400
        
        image_path = "temp.png"
        file.save(image_path)
        image_url = upload_to_imgbb(image_path)
        analysis = analyze_image(image_url)
        
        return jsonify({'image_url': image_url, 'analysis': analysis})
    except Exception as e:
        print(f"Error analyzing image: {e}")
        return jsonify({'error': 'Failed to analyze image'}), 500

# -------------------------
# Health Check
# -------------------------
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Flask backend is running'})

# -------------------------
# Run Server
# -------------------------
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
