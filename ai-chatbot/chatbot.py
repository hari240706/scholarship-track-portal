from flask import Flask, request, jsonify
from googletrans import Translator

app = Flask(__name__)
translator = Translator()

@app.route('/translate', methods=['POST'])
def translate_text():
    data = request.json
    text = data.get('text')
    target_lang = data.get('target_lang', 'en')
    translated = translator.translate(text, dest=target_lang)
    return jsonify({'translated_text': translated.text})

@app.route('/explain', methods=['POST'])
def explain_term():
    term = request.json.get('term')
    explanations = {
        "domicile": "Proof that you reside in a particular state.",
        "creamy layer": "OBC individuals with higher income, not eligible for reservation."
    }
    return jsonify({'explanation': explanations.get(term.lower(), "Term not found.")})

if __name__ == '__main__':
    app.run(port=5000)

@app.route('/ocr', methods=['POST'])
def ocr():
    from PIL import Image
    import pytesseract
    import base64
    import io

    data = request.json
    image_data = base64.b64decode(data['image_base64'])
    image = Image.open(io.BytesIO(image_data))
    text = pytesseract.image_to_string(image)
    return jsonify({'extracted_text': text})

