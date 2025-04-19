// FeatureSection.js
import React from "react";
import "./FeatureSection.css";

function FeatureSection() {
  return (
    <section className="feature-section">
      <h2 className="feature-heading">What We Analyse</h2>
      <ul className="feature-list">
        <li>
            <img src="/search.png" alt="dialogue" className="feature-icon" />
            Word choice (Confident vs Needy)
        </li>

        <li>
            <img src="/stopwatch.png" alt="clock" className="feature-icon" />
            Timing &amp; Emoji use
        </li>
        
        <li> 
            <img src="/no-lover.png" alt="clock" className="feature-icon" />
            Red Flag Triggers
        </li>
        
        <li>
            <img src="/message.png" alt="clock" className="feature-icon" />
            Flirt Game Levels (Dry, Fun, Smooth, Awkward)
        </li>

        <li>
            <img src="/growth.png" alt="clock" className="feature-icon" />
            Pattern Recognition From 1M+ Chat Samples
        </li>

      </ul>
    </section>
  );
}

export default FeatureSection;
