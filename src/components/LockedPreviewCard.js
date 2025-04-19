// LockedPreviewCard.js
import React from "react";
import "./LockedPreviewCard.css";

function LockedPreviewCard({ previewText, triggerUnlock }) {
  return (
    <div className="locked-preview-card">
      <p className="preview-text">{previewText}</p>
      <button className="unlock-preview-btn" onClick={triggerUnlock}>
        Unlock full reply – £0.99
      </button>
      <p className="upsell-note">
        Or get unlimited replies for just £4.99/month
      </p>
    </div>
  );
}

export default LockedPreviewCard;
