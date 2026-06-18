from flask import Flask, render_template, request, jsonify
from openai import OpenAI
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from database import init_db, save_hearing, get_all_hearings
import json
import datetime

app = Flask(__name__)
CORS(app)
init_db()
today = datetime.date.today().isoformat()  # e.g. "2026-06-18"

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

@app.route("/risk", methods=["POST"])
def risk_assessment():
    data = request.get_json()
    case_text = data["case_text"]

    response = client.chat.completions.create(
        model="llama3.2",
        max_tokens=500,
        messages=[
            {
                "role": "system",
                "content": """You are a judicial AI assistant. Your only job is to analyse court cases.

        Always respond in this exact format, no matter what the user sends:

        {
        "risk_level": "Risk Level (Low / Medium / High)",
        "risk_score": Risk Score (0-10),
        "reasons": [List of reasons for the risk assessment],
        "analysis_depth": "Analysis Depth Recommended (Low / Medium / High) — One sentence reason"
        }

        If the input is not a court case, respond only with:
        NA for all fields in the JSON response. """
            },
            {
                "role": "user",
                "content": case_text
            }
        ]
    )

    result = response.choices[0].message.content
    # print("RAW AI OUTPUT:")
    # print(result)
    result = result.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    # if model cut off before closing brace, add it
    if not result.endswith("}"):
        result = result + "\n}"
    parsed_result = json.loads(result)  # Parse the JSON string into a Python dictionary
    return jsonify(parsed_result)

@app.route("/schedule", methods=["POST"])
def schedule_hearing():
    data = request.get_json()
    defendant = data["defendant"]
    charge = data["charge"]
    risk_level = data["risk_level"]

    response = client.chat.completions.create(
        model="llama3.2",
        max_tokens=500,
        messages=[
            {
                "role": "system",
                "content": f"""You are a judicial scheduling assistant.
                                Today's date is {today}.
                                Based on the risk level provided, return a recommended court hearing date.
                                High = within 2 weeks, Medium = within 1 month, Low = within 3 months.
                                Return only the date in YYYY-MM-DD format. No explanation, no other text."""},
            {
                "role": "user",
                "content": f"case_text: Defendant: {defendant}. Charge: {charge}. Risk Level: {risk_level}."
            }
        ]
    )

    result = response.choices[0].message.content
    # print("RAW AI OUTPUT:")
    # print(result)
    result = result.strip().removeprefix("```").removesuffix("```").strip()
    save_hearing(defendant, charge, risk_level, result)
    return jsonify({"hearing_date": result, "defendant": defendant})

@app.route("/hearings", methods=["GET"])
def get_hearings():
    hearings = get_all_hearings()

    hearings_list = []
    for hearing in hearings:
        hearings_list.append({
            "id": hearing[0],
            "defendant": hearing[1],
            "charge": hearing[2],
            "risk_level": hearing[3],
            "hearing_date": hearing[4],
            "created_at": hearing[5]
        })

    return jsonify(hearings_list)

if __name__ == "__main__":
    app.run(debug=True)