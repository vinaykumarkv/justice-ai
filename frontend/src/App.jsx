import { useState } from "react"

function App() {
  const [defendant, setDefendant] = useState("")
  const [charge, setCharge] = useState("")
  const [priorOffences, setPriorOffences] = useState("")
  const caseText = ` Defendant: ${defendant}.\n Charge: ${charge}.\n Prior offences: ${priorOffences}`
  const [briefing, setBriefing] = useState("")
  const [loading, setLoading] = useState(false)

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
    setLoading(false)
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
        style={{ width: "100%", padding: "8px", fontSize: "14px", marginTop: "8px" }}
        placeholder="Case text will appear here..."  
        value={caseText}
        readOnly
        style={{ background: "#f9f9f9", color: "#333", border: "1px solid #ccc", borderRadius: "4px" }}
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
    </div>
  )
}

export default App