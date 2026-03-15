import requests
import os

BASE_URL = "http://localhost:8000/api"

# Note: You'll need a valid JWT token to run this.
# This script is a template for manual verification using requests.
def test_pdf_upload(token, file_path):
    url = f"{BASE_URL}/quiz/generate-from-pdf"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    files = {
        "pdf": open(file_path, "rb")
    }
    data = {
        "difficulty": "medium",
        "num_questions": 5
    }
    
    response = requests.post(url, headers=headers, files=files, data=data)
    print(f"Status: {response.status_code}")
    print(f"Body: {response.json()}")

if __name__ == "__main__":
    # Example usage:
    # test_pdf_upload("YOUR_TOKEN", "test.pdf")
    pass
