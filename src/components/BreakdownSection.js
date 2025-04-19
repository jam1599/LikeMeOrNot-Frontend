// BreakdownSection.js
import React from "react";
import "./BreakdownSection.css";

function BreakdownSection() {
  return (
    <section className="breakdown-section">
       <h2 className="breakdown-heading">Not Sure What To Expect?</h2>

        {/* Second line, smaller or same size, depending on your preference */}
        <p className="breakdown-subheading">Here’s a Sample Breakdown</p>
      <div className="breakdown-layout">
        {/* Left Column: Chat Snippet */}
        <div className="chat-column">
          <div className="chat-bubble user-bubble">
            <p><strong>Jenny:</strong> Hey, What are you up to this weekend?</p>
          </div>
          <div className="chat-bubble self-bubble">
            <p>
            <strong>Kevin:</strong> I’m thinking of going on an adventure. Ever tried spontaneous road trips??
            </p>
          </div>
          <div className="chat-bubble user-bubble">
            <p><strong>Jenny:</strong> Ooh, sounds fun! Where would we go?</p>
          </div>
        </div>

        {/* Right Column: Vibe Score & Details */}
        <div className="score-column">
         <img src="/robot.png" alt="Chat Robot" className="score-icon" />
          <div className="score-header">

            <div>
              <span className="vibe-score-text">Vibe Score</span>
              <span className="vibe-score-number">7.8/10</span>
            </div>
          </div>

          <ul className="score-details">
            {/* Flirt Style */}
            <li className="score-item">
                <img src="/heart.png" alt="Flirt" className="flirt-icon" />
                <span className="detail-label">Flirt Style:</span>
                <span className="detail-value">Playful &amp; Smooth</span>
            </li>

            {/* Red Flags */}
            <li className="score-item">
                <img src="/warning.png" alt="Red Flags" className="RedFlag-icon" />
                <span className="detail-label">Red Flags:</span>
                <span className="detail-value">None</span>
            </li>

            {/* Tip */}
            <li className="score-item">
                <img src="/box-tips.png" alt="Tips" className="box-tips-icon" />
                <span className="detail-label">Tip:</span>
                <span className="detail-value">
                You nailed the timing. Next time, try adding a tease emoji for bonus charm.
                </span>
            </li>
            </ul>

        </div>
      </div>
    </section>
  );
}

export default BreakdownSection;
