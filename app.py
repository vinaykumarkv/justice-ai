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
                "content": "You are a judicial AI assistant. Given a case summary, provide: 1) A brief overview 2) Key risk factors 3) Recommended analysis depth (Low / Medium / High)."
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