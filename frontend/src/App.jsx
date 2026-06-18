import { useState, useEffect } from "react"

function App() {
  const [defendant, setDefendant] = useState("")
  const [charge, setCharge] = useState("")
  const [priorOffences, setPriorOffences] = useState("")
  const caseText = ` Defendant: ${defendant}.\n Charge: ${charge}.\n Prior offences: ${priorOffences}`
  const [briefing, setBriefing] = useState("")
  const [loading, setLoading] = useState(false)
  const [risk, setRisk] = useState(null)
  const [schedule, setSchedule] = useState(null)
  const [hearingDates, setHearingDates] = useState("")
  useEffect(() => {
    fetch("http://localhost:5000/hearings")
    .then(response => response.json())
    .then(data => setHearingDates(data))
  },[])

  async function getBriefing() {
    setLoading(true)
    setBriefing("")

    const response = await fetch("http://localhost:5000/brief", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ case_text: caseText })
    })

    const data = await response.json()
    setBriefing(data.briefing)
    

    const riskResponse = await fetch("http://localhost:5000/risk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ case_text: caseText })
    })

    const riskData = await riskResponse.json()
    setRisk(riskData)
    setLoading(false)
  }
    async function scheduleHearing() {
        const scheduleResponse = await fetch("http://localhost:5000/schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ defendant, charge, risk_level: risk.risk_level })
        })
        const scheduleData = await scheduleResponse.json()
        setSchedule(scheduleData)
      
  }

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", padding: "0 20px", fontFamily: "sans-serif" }}>
      <h1>Justice AI — Case Briefing</h1>
      <h2>Defendant:</h2>
      <input
        type="text"
        style={{ width: "100%", padding: "8px", fontSize: "14px" }}
        placeholder="Enter defendant name..."
        value={defendant}
        onChange={(e) => setDefendant(e.target.value)}
      />
      <h2>Charge:</h2>
      <input
        type="text"
        style={{ width: "100%", padding: "8px", fontSize: "14px" }}
        placeholder="Enter charge details..."
        value={charge}
        onChange={(e) => setCharge(e.target.value)}
      />
      <h2>Prior Offences:</h2>
        
      <input
        type="text"
        style={{ width: "100%", padding: "8px", fontSize: "14px" }}
        placeholder="Enter prior offences..."
        value={priorOffences}
        onChange={(e) => setPriorOffences(e.target.value)}
      />

      <h2>Case Text:</h2>
      <textarea
        rows={5}
        style={{ width: "100%", padding: "8px", fontSize: "14px", marginTop: "8px", background: "#f9f9f9", color: "#333", border: "1px solid #ccc", borderRadius: "4px" }}
        placeholder="Case text will appear here..."  
        value={caseText}
        readOnly
      />

      <button
        onClick={getBriefing}
        style={{ padding: "10px 24px", background: "#1a56db", color: "white", border: "none", cursor: "pointer", marginTop: "8px" }}
      >
        {loading ? "Thinking..." : "Generate Briefing"}
      </button>

      {briefing && (
        <div style={{ marginTop: "24px", background: "#f4f4f4", padding: "16px", whiteSpace: "pre-wrap" }}>
          {briefing}
        </div>
      )}

      {risk && (
        <div style={{ marginTop: "16px", padding: "16px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h3>Risk Assessment</h3>
          <span style={{
            padding: "4px 12px",
            borderRadius: "12px",
            background: risk.risk_level === "High" ? "#fee2e2" : risk.risk_level === "Medium" ? "#fef9c3" : "#dcfce7",
            color: risk.risk_level === "High" ? "#991b1b" : risk.risk_level === "Medium" ? "#854d0e" : "#166534",
            fontWeight: "bold"
          }}>
            {risk.risk_level} {" "} Risk — Score: {risk.risk_score}/10
          </span>
          <ul style={{ marginTop: "12px" }}>
            {risk.reasons.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
          <p><strong>Recommended depth:</strong> {risk.analysis_depth}</p>
        </div>
      )}

      {risk && (<button
        onClick={scheduleHearing}
        style={{ padding: "10px 24px", background: "#1a56db", color: "white", border: "none", cursor: "pointer", marginTop: "8px" }}
      >
        {loading ? "Thinking..." : "Generate Schedule"}
      </button>)}

      {schedule && (
        <div style={{ marginTop: "16px", padding: "16px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h3>Next Hearing Date</h3>
          <span style={{
            padding: "4px 12px",
            borderRadius: "12px",
            background: risk.risk_level === "High" ? "#fee2e2" : risk.risk_level === "Medium" ? "#fef9c3" : "#dcfce7",
            color: risk.risk_level === "High" ? "#991b1b" : risk.risk_level === "Medium" ? "#854d0e" : "#166534",
            fontWeight: "bold"
          }}>
            Defendant: {" "} {schedule.defendant}  — Next Hearing Date: {schedule.hearing_date}
          </span>
        </div>
      )}

      {hearingDates.length > 0 && (
        <div style={{ marginTop: "16px", padding: "16px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h3>All Scheduled Hearings</h3>
          <ul>
            {hearingDates.map((hearing, index) => (
              <li key={index}>
                Defendant: {hearing.defendant}, Charge: {hearing.charge}, Risk Level: {hearing.risk_level}, Hearing Date: {hearing.hearing_date}
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
    
  )
}

export default App