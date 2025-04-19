// src/components/PremiumPage.js
import React, { useState, useEffect } from "react";
import HeroSection from "./HeroSection";

export default function PremiumPage({ token }) {
  const [expiry, setExpiry] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch their expiry date
  useEffect(() => {
    fetch("http://localhost:8000/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(user => {
        setExpiry(user.subscription_expiry);
      })
      .catch(err => console.error("Failed to load subscription:", err))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p>Checking premium status…</p>;

  const isStillValid = expiry && new Date(expiry) > new Date();

  return (
    <HeroSection
      onAnalyzeText={() => {}}
      onAnalyzeImage={() => {}}
      analysisResult={null}
      onResetAnalysis={() => {}}
      loading={false}
      // unlock only if expiry is in the future
      freeScanUsed={!isStillValid}
      triggerPayment={() => {}}
      goToPremium={() => window.location.href = "/"}  // send them back to / to re‑pay
      triggerUnlock={() => {}}
      updateAnalysisResult={() => {}}
      token={token}
      setToken={() => {}}
    />
  );
}
