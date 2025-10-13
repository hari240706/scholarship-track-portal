import json
import re
import ast
import ollama
from typing import Dict, List

# Model to use
MODEL = "mistral"

def generate(prompt: str) -> str:
    """Call the Mistral model via Ollama and return its raw response."""
    result = ollama.generate(model=MODEL, prompt=prompt)
    return result["response"]

def extract_json(text: str) -> str:
    """Extract the first JSON-like object or array from text."""
    match = re.search(r'(\{.*\}|\[.*\])', text, flags=re.DOTALL)
    return match.group(1) if match else ""

def safe_parse_json(text: str):
    """Attempt to parse JSON; fallback to Python literal eval for single quotes."""
    try:
        return json.loads(text)
    except Exception:
        try:
            return ast.literal_eval(text)
        except Exception:
            print("Could not parse JSON:", text)
            return {}

def match_scholarship(student: Dict, scholarship: Dict) -> Dict:
    prompt = f"""
You are a scholarship-matching agent.
Student profile: {json.dumps(student)}
Scholarship details: {json.dumps(scholarship)}
Return ONLY a JSON with:
- match_score (0–100)
- reasons: list of brief explanation strings
"""
    resp = generate(prompt)
    return safe_parse_json(extract_json(resp))

def parse_eligibility(text: str) -> Dict:
    prompt = f"""
Convert this eligibility text into structured JSON with fields:
age_range, education_level, income_criteria, location, other_criteria.
Text: "{text}"
Return ONLY the JSON object.
"""
    resp = generate(prompt)
    return safe_parse_json(extract_json(resp))

def translate_to_hindi(text: str) -> str:
    prompt = f"""
Translate the following scholarship description into Hindi, preserving all details.
Return ONLY the translated text.
Text: "{text}"
"""
    return generate(prompt).strip()

def find_similar_scholarships(query: str, corpus: List[str], top_k: int = 3) -> List[int]:
    scores = []
    for i, doc in enumerate(corpus):
        sim_prompt = f"""
Rate similarity (0–100) between query and description.
Query: "{query}"
Description: "{doc}"
Return only the number.
"""
        score_text = generate(sim_prompt)
        try:
            score = float(re.search(r'(\d+(\.\d+)?)', score_text).group(1))
        except:
            score = 0.0
        scores.append((i, score))
    scores.sort(key=lambda x: x[1], reverse=True)
    return [idx for idx, _ in scores[:top_k]]

if __name__ == "__main__":
    # Example data
    student = {
        "name": "Asha Verma",
        "age": 19,
        "education_level": "Undergraduate",
        "gpa": 8.7,
        "category": "SC",
        "annual_family_income": 300000,
        "interests": ["Computer Science", "AI"]
    }

    scholarship = {
        "title": "National Merit Scholarship",
        "description": "Award for students with high academic performance in science streams.",
        "eligibility": "Open to SC/ST students aged 17–22 enrolled in full-time B.Sc. or B.Tech programs, with family income under ₹2.5 lakh per annum.",
        "deadline": "2025-11-30",
        "amount": 50000
    }

    # 1. Match
    match = match_scholarship(student, scholarship)
    print("Match Result:", match)

    # 2. Parse eligibility
    elig = parse_eligibility(scholarship["eligibility"])
    print("Parsed Eligibility:", elig)

    # 3. Translate description
    hindi = translate_to_hindi(scholarship["description"])
    print("Hindi Description:", hindi)

    # 4. Similarity search example
    corpus = [
        "Scholarship for engineering students with GPA above 8.0",
        "Merit scholarship for science stream SC/ST students",
        "Financial aid for arts students under ₹3 lakh income"
    ]
    top_idxs = find_similar_scholarships("SC/ST science scholarship under ₹2.5 lakh", corpus)
    print("Top similar scholarships:", [corpus[i] for i in top_idxs])
