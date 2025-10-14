from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/score', methods=['POST'])
def score():
    data = request.json
    user = data['user']
    scheme = data['scheme']

    score = 100
    gaps = []

    if user['state'] != scheme['state_filter']:
        score -= 20
        gaps.append('Domicile mismatch')

    if user['category'] != scheme['category_filter']:
        score -= 20
        gaps.append('Category mismatch')

    if user['academic_level'] not in scheme['eligibility_criteria'].get('academic_levels', []):
        score -= 20
        gaps.append('Academic level mismatch')

    return jsonify({'confidence_score': score, 'gap_analysis': gaps})

if __name__ == '__main__':
    app.run(port=5001)
