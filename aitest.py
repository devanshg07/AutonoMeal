import openai
import base64
import requests
from dotenv import load_dotenv
import os

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
IMGBB_API_KEY = os.getenv("IMGBB_API_KEY")

# 2️⃣ Upload local image to ImgBB
def upload_to_imgbb(image_path):
    with open(image_path, "rb") as f:
        encoded_image = base64.b64encode(f.read())
    url = "https://api.imgbb.com/1/upload"
    payload = {
        "key": IMGBB_API_KEY,
        "image": encoded_image
    }
    response = requests.post(url, data=payload)
    response.raise_for_status()
    return response.json()["data"]["url"]  # Public image URL

image_url = upload_to_imgbb("image.png")
print(f"Uploaded image URL: {image_url}")

# 3️⃣ Send image URL to GPT-4V
response = openai.responses.create(
    model="gpt-4.1-mini",
    input=[
        {
            "role": "user",
            "content": [
                {"type": "input_text", "text": "Give me a star rating out of 10. Describe this image in detail and give me an explanation give me 2-3 sentences."},
                {"type": "input_image", "image_url": image_url}
            ]
        }
    ]
)

# 4️⃣ Print GPT-4V description
print("AI Description:")
print(response.output_text)
