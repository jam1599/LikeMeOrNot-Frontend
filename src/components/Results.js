// Results.js
import React from "react";
import "./Results.css";

const Results = ({ result, onReset }) => {
  // Optionally, you can parse 'result' into separate lines if your backend returns a big string.
  // For this example, let's assume 'result' is a simple multiline text or already structured.
  // If you have a single string, you could parse it here to fill in the fields below.

  // Example placeholders for each field (you can parse 'result' in real usage):
  const likabilityScore = "8/10";
  const tone = "The conversation maintains a friendly and positive tone with a shared sense of enthusiasm.";
  const keyPhrases = `"spontaneous road trip", "epic getaway", "flexible route"`;
  const tips = `You're on the right track — throw in a playful compliment and keep the momentum going.`;
  
  return (
    <div className="analysis-card">
      <h2 className="analysis-card-title">Analysis Result</h2>
      
      <p className="analysis-card-line">
        <span className="analysis-card-label">Likability Score:</span> {likabilityScore}
      </p>
      <p className="analysis-card-line">
        <span className="analysis-card-label">Tone:</span> {tone}
      </p>
      <p className="analysis-card-line">
        <span className="analysis-card-label">Key Phrases:</span> {keyPhrases}
      </p>
      <p className="analysis-card-line">
        <span className="analysis-card-label">Tips:</span> {tips}
      </p>
      
      <p className="analysis-card-line highlight">
        Want the perfect line to keep it going?
      </p>
      
      <button className="analysis-card-button" onClick={onReset}>
        Unlock My Next Move – € 0,99
      </button>
    </div>
  );
};

export default Results;
