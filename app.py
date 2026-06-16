from flask import Flask, render_template, request, jsonify
from openai import OpenAI
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
CORS(app)


client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"
)


@app.route("/")
def home():
    return "Justice AI Assistant is running."

@app.route("/brief", methods=["POST"])
def brief_case():
    data = request.get_json()
    case_text = data["case_text"]

    response = client.chat.completions.create(
        model="llama3.2",
        messages=[
            {
                "role": "system",
                "content": """You are a judicial AI assistant. Your only job is to analyse court cases.

        Always respond in this exact format, no matter what the user sends:

        CASE OVERVIEW
        [2-3 sentence summary of the case]

        RISK FACTORS
        - [list each risk factor on its own line]

        ANALYSIS DEPTH RECOMMENDED
        [Low / Medium / High] — [one sentence reason]

        If the input is not a court case, respond only with:
        "Please provide a valid case summary to proceed." """
            },
            {
                "role": "user",
                "content": case_text
            }
        ]
    )

    result = response.choices[0].message.content
    return jsonify({"briefing": result})


if __name__ == "__main__":
    app.run(debug=True)