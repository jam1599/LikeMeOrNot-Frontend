import React from "react";
import "./FooterCTA.css";

function FooterCTA() {
  const handleScrollToChat = () => {
    const chatSection = document.getElementById("paste-chat-section");
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="footer-cta">
      <p className="cta-text">Think you’re elite? Prove it.</p>
      <button className="cta-btn" onClick={handleScrollToChat}>
        Get Your Chat Rated Now
      </button>
    </section>
  );
}

export default FooterCTA;
