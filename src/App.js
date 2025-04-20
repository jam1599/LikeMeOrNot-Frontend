import React, { useState, useEffect } from "react";  // ← added useEffect
import "./App.css";
import HeroSection from "./components/HeroSection";
import BreakdownSection from "./components/BreakdownSection";
import FeatureSection from "./components/FeatureSection";
import FooterCTA from "./components/FooterCTA";

// ← Grab your backend base URL from .env
const API = process.env.REACT_APP_API_URL; // e.g. https://likemeornot-backend.onrender.com

function App() {
  const [freeScanUsed, setFreeScanUsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [token, setToken] = useState(""); // Store JWT after login

  // ← NEW: track subscription & expiry
  const [user, setUser]         = useState(null);
  const [subscription, setSubscription] = useState("free");
  const [expiry, setExpiry]             = useState(null);
 


  // ← NEW: fetch current user's subscription info whenever token changes
// App.js
// useEffect(() => {
//   if (!token) return;

//   fetch("http://localhost:8000/users/me", {
//     headers: { Authorization: `Bearer ${token}` },
//   })
//     .then(res => {
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       return res.json();
//     })
//     .then(u => {
//       setUser(u);
//       setSubscription(u.subscription);
//       setExpiry(u.subscription_expiry
//         ? new Date(u.subscription_expiry)
//         : null
//       );
//     })
//     .catch(err => console.error("Failed to load user info:", err));
// }, [token]);

// App.js (inside your `App()` component, after you declare `user, setUser`)
useEffect(() => {
  if (!token) {
    setUser(null);
    return;
  }

  // fetch("http://localhost:8000/users/me", {
  //   headers: { Authorization: `Bearer ${token}` },
  // })
    fetch(`${API}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();             // ← parse JSON here!
    })
    .then(userData => {
      setUser(userData);             // now this is your actual object
      setSubscription(userData.subscription);
      setExpiry(
        userData.subscription_expiry
          ? new Date(userData.subscription_expiry)
          : null
      );
    })
    .catch(err => console.error("Failed to load user info:", err));
}, [token]);

// App.js (in the same App() component)
useEffect(() => {
  if (
    subscription === "monthly" &&
    expiry instanceof Date &&
    expiry > new Date()
  ) {
    // unlock their free scan...
    setFreeScanUsed(false);
    // ...and throw away whatever old analysisResult was showing
    setAnalysisResult(null);
  }
}, [subscription, expiry]);

useEffect(() => {
  if (!token) {
    setAnalysisResult(null);
    setFreeScanUsed(false);
  }
}, [token]);


  // Compute whether analysis is allowed
  const isSubscriptionValid = (() => {
    if (subscription === "" || subscription === "free") {
      return !freeScanUsed;
    }
    if (subscription === "one_time") {
      return !expiry;
    }
    if (subscription === "monthly") {
      return expiry && new Date() < expiry;
    }
    return false;
  })();
  
  // move your current HeroSection’s handleLogout up here:
  const handleLogout = () => {
    setToken("");
    setAnalysisResult(null);
    setFreeScanUsed(false);
  };

  // Dummy payment handlers
  const triggerPayment = () => {
    console.log("Trigger payment for one reply");
    unlockFeatures();
  };

  const goToPremium = () => {
    console.log("Navigate to premium subscription page");
    unlockFeatures();
  };

  const triggerUnlock = () => {
    console.log("Unlocking full reply");
    unlockFeatures();
  };

  // Reset free scan and analysis result
  const unlockFeatures = () => {
    console.log("Features unlocked: free scan reset.");
    setFreeScanUsed(false);
    setAnalysisResult(null);
  };

  // Updates analysis result and flags free scan as used.
  const updateAnalysisResult = (result) => {
    setAnalysisResult(result);
    setFreeScanUsed(true);
    setLoading(false);
  };

  // UPDATED: Function to analyze text via your backend (for pasted text)
  // Now it accepts a token parameter and passes it in the Authorization header.
  const handleAnalyzeText = async (text, jwtToken) => {  
    if (freeScanUsed) {
      console.log("Free scan already used; please unlock for additional analysis.");
      return;
    }
    setLoading(true);
    try {
      console.log("Sending text to backend for analysis...");
      // const response = await fetch("http://localhost:8000/analyze", {
        const response = await fetch(`${API}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": jwtToken ? `Bearer ${jwtToken}` : ""
        },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      console.log("Analysis result received:", data.report);
      updateAnalysisResult(data.report);
    } catch (error) {
      console.error("Error analyzing text:", error);
      updateAnalysisResult("Analysis failed.");
    }
  };

  // New: Function to analyze an image via your backend using EasyOCR.
  const handleAnalyzeImage = async (file) => {
    if (freeScanUsed) {
      console.log("Free scan already used; please unlock for additional analysis.");
      return;
    }
    setLoading(true);
    try {
      console.log("Sending image to backend for analysis...");
      const formData = new FormData();
      formData.append("image", file);
      // const response = await fetch("http://localhost:8000/analyze-image", {
        const response = await fetch(`${API}/analyze-image`, {
        method: "POST",
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await response.json();
      console.log("Image analysis result received:", data.report);
      updateAnalysisResult(data.report);
    } catch (error) {
      console.error("Error analyzing image:", error);
      updateAnalysisResult("Analysis failed.");
    }
  };

  // Reset the analysis result so the user can try another analysis.
  const handleResetAnalysis = () => {
    console.log("Reset analysis triggered.");
    setAnalysisResult(null);
    // Optionally allow another free scan:
    // setFreeScanUsed(false);
  };

  return (
    <div className="App">
      <HeroSection
        onAnalyzeText={handleAnalyzeText}
        onAnalyzeImage={handleAnalyzeImage}  // Pass the image analysis function
        analysisResult={analysisResult}
        onResetAnalysis={() => setAnalysisResult(null)}
        loading={loading}
//        freeScanUsed={freeScanUsed}
        freeScanUsed={!isSubscriptionValid}
        triggerPayment={triggerPayment}
        goToPremium={goToPremium}
        triggerUnlock={triggerUnlock}
        updateAnalysisResult={result => {
          setAnalysisResult(result);
          setFreeScanUsed(true);
          setLoading(false);
        }}
        onLogout={handleLogout}
        token={token}           // Pass the current token to HeroSection
        setToken={setToken}     // Allow HeroSection to update the token via login
        user={user}
        subscription={subscription}
        expiry={expiry}
      />
      <BreakdownSection />
      <FeatureSection />
      <FooterCTA />
    </div>
  );
}

export default App;