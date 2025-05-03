
import React, { useRef, useState } from "react";
import "./HeroSection.css";
import LockedReply from "./LockedReply";
// import LockedPreviewCard from "./LockedPreviewCard";
// import Results from "./Results";
import { loadStripe } from "@stripe/stripe-js"; // Import Stripe.js

// Initialize Stripe with your live or test publishable key.
// const stripePromise = loadStripe("pk_test_51QmxXNPqcp3jD0diXZgV5rEafhQarXnFPDxxmk9ykMOKikRbAiqUh7IyJbgjWvF3c2w1uuno1IvI8wlHUVLxas6a00JZiwucx7");
// HeroSection.js (or App.js)
const API = process.env.REACT_APP_API_URL;  // → "https://likemeornot-backend.onrender.com"
console.log("👉 API_BASE_URL =", API);

const stripePromise = loadStripe("pk_live_51QmxXHLIfxI8v49WklmwIPbZsneDNa1cK2YuEVBDNGFcNphXi5PrxFGMK9sUE9ilG1hUyWScTDUV8JvjUM5YperD00LFcjDWCY");
/**
 * This component includes:
 *  - Login, Logout
 *  - Create Account (registration) that actually sends data to /users
 *  - Basic placeholders for "forgot password"
 *  - Upload & Paste chat text
 *  - Show "analysisResult"
 */
function HeroSection({
  onAnalyzeText,      // function for analyzing text (parent)
  loading,            // whether analysis is in progress
  freeScanUsed,       // whether the free scan is used up
  analysisResult,     // string result from backend
  onResetAnalysis,    // resets analysis result
  triggerPayment,
  goToPremium,
  triggerUnlock,
  updateAnalysisResult,
  user,           // ← full user object from App
  subscription,   // ← subscription type
  expiry,          // ← JS Date or null
  token,          // from App.js
  setToken        // setter from App.js
}) {

  const [showProfile, setShowProfile] = useState(false);
  const fileInputRef = useRef(null);

  // Pasted text state
  const [showTextArea, setShowTextArea] = useState(false);
  const [pastedText, setPastedText] = useState("");

  // Show locked UI after free scan used
  const [showLockedUI, setShowLockedUI] = useState(false);

  // ============ LOGIN & USER AUTH STATES ============
  // const [loggedIn, setLoggedIn] = useState(false);
  const loggedIn = Boolean(token);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [token, setToken] = useState(""); // stores JWT after login

  // Show/hide login modal
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Show/hide 'Forgot Password?' modal
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Show/hide 'Create Account' (registration) modal
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // For create-account form
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  /**
   * Utility: parse the AI result (if it's valid JSON, or fallback).
   */
  const parseAiResult = (rawResult) => {
    try {
      const data = JSON.parse(rawResult);
      return {
        score: data.score || "N/A",
        tone: data.tone || "N/A",
        keyPhrases: data.keyPhrases || [],
        tips: data.tips || "N/A",
      };
    } catch (err) {
      console.error("Error parsing AI result:", err);
      return {
        score: "N/A",
        tone: rawResult,
        keyPhrases: [],
        tips: "No specific tips",
      };
    }
  };

  /**
   * Utility: if missing "/", convert "7" => "7/10".
   */
  const formatScore = (scoreStr) => {
    if (!scoreStr) return "N/A";
    return scoreStr.includes("/") ? scoreStr : `${scoreStr}/10`;
  };

  // ============ 1) LOGIN HANDLER ============
  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      // const response = await fetch("http://localhost:8000/token", {
        const response = await fetch(`${API}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      const data = await response.json();
      if (data.access_token) {
        setToken(data.access_token);    // lift up into App
        setShowLoginModal(false);
        setToken(data.access_token)
        setShowLoginModal(false);
        console.log("Logged in, token:", data);
      } else {
        console.error("Login failed:", data);
      }
    } catch (err) {
      console.error("Error during login:", err);
    }
  };

  // ============ 2) LOGOUT HANDLER ============
  const handleLogout = () => {
    // setToken("");
    // console.log("User logged out");
    // setLoggedIn(false);
    // setUsername("");
    // setPassword("");
    // console.log("User logged out");
    setToken("");            // clear the App’s token → loggedIn becomes false
    console.log("User logged out");
     setShowProfile(false);
  };

  // ============ 3) FORGOT PASSWORD (placeholder) ============
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    alert("Password reset link has been sent (placeholder).");
    setShowForgotModal(false);
  };

  // ============ 4) CREATE ACCOUNT (REGISTRATION) ============
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make a POST request to your /users endpoint to actually store user data
      // const response = await fetch("http://localhost:8000/users", {
        const response = await fetch(`${API}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: regUsername,
          email: regEmail,
          password: regPassword,
          subscription: "free",
        }),
      });
      const data = await response.json();

      if (data.id) {
        console.log("User created successfully:", data);
        alert("User created! You can now login.");
        setShowRegisterModal(false);
        // Optionally, auto-fill the login form with the newly created username/password
        setUsername(regUsername);
        setPassword(regPassword);
        setRegUsername("");
        setRegEmail("");
        setRegPassword("");
      } else {
        console.error("Error creating user:", data);
        alert("Error creating user. Check console for details.");
      }
    } catch (error) {
      console.error("Error during register:", error);
      alert("Error during registration. See console for details.");
    }
  };

  // ============ 5) ANALYZE TEXT LOCALLY W/ JWT ============
  const handleAnalyzeTextLocal = async (text) => {
    if (!loggedIn) {
      console.error("User must be logged in to analyze text.");
      return;
    }
    try {
      // const response = await fetch("http://localhost:8000/analyze", {
        const response = await fetch(`${API}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      console.log("Backend analysis response for text:", data);

      if (data.report) {
        updateAnalysisResult(data.report);
      } else {
        updateAnalysisResult("No analysis result received.");
      }
    } catch (error) {
      console.error("Error analyzing text locally:", error);
      updateAnalysisResult("Analysis failed.");
    }
  };

  // For backwards-compat, let's keep the parent call:
  const handleAnalyzeTextParent = (text) => {
    onAnalyzeText(text, token);
    setShowLockedUI(false);
  };

  // We choose to call our local approach:
  const handleAnalyzeText = (text) => {
    // Option A:
    handleAnalyzeTextLocal(text);

    // Option B: also call parent's
    // handleAnalyzeTextParent(text);
  };

  // ============ 6) HANDLE UPLOAD (ANALYZE IMAGE) ============
  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    if (!loggedIn) {
      console.error("Must be logged in to analyze image.");
      return;
    }
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file.name);
      const formData = new FormData();
      formData.append("image", file);
      try {
        // const response = await fetch("http://localhost:8000/analyze-image", {
          const response = await fetch(`${API}/analyze-image`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
        const data = await response.json();
        console.log("Backend analysis response for image:", data);

        if (data.report) {
          updateAnalysisResult(data.report);
        } else {
          updateAnalysisResult("No analysis result received.");
        }
      } catch (error) {
        console.error("Error analyzing screenshot:", error);
        updateAnalysisResult("Analysis failed.");
      }
    }
  };

  // ============ 7) PASTE CHAT TEXT ============
  const handlePasteClick = () => {
    setShowTextArea(!showTextArea);
  };

  const handleTextChange = (event) => {
    setPastedText(event.target.value);
  };

  const handleAnalyzeClick = () => {
    if (pastedText.trim()) {
      handleAnalyzeText(pastedText);
    }
  };

  // ============ 8) "ANALYZE ANOTHER" => RESET + SHOW LOCKED UI? ============
  const handleAnalyzeAnother = () => {
    if (onResetAnalysis) {
      onResetAnalysis();
    }
    setShowLockedUI(true);
  };

  // ============ 9) STRIPE: one-time payment checkout (optional) ============
  const handleStripeCheckout = async () => {
    const stripe = await stripePromise;
    try {
      // const response = await fetch("http://localhost:8000/create-checkout-session", {
        const response = await fetch(`${API}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const session = await response.json();
      const result = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });
      if (result.error) {
        console.error(result.error.message);
      }
    } catch (err) {
      console.error("Error creating Stripe session:", err);
    }
  };



  // Let's parse the analysis result if we have one
  const parsed = analysisResult ? parseAiResult(analysisResult) : null;

  return (
    <section className={`hero-section ${analysisResult ? "expanded" : ""}`}>
      {/* HEADER: Logo + Title + optional user profile */}
      <header  id="paste-chat-section" className="hero-header">
        <img src="/LOGS.png" alt="Logo" className="hero-logo" />
        

        {user && (
            <div className="hero-user-profile">
              <button 
                className="username-button" 
                onClick={() => setShowProfile(v => !v)}>
                <span className="username-text">{user.username}</span>
                <img src="/profile.png" className="user-icon" alt="User" />
                
              </button>

              {showProfile && (
                <div className="profile-dropdown">
                  <h2 className="PROFILE"> PROFILE </h2>
                  <p><strong>Name:</strong> {user.username}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Subscription:</strong> {subscription}</p>
                  <p><strong>Expires:</strong> {expiry ? expiry.toLocaleString() : "—"}</p>
                  <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          )}

      </header>

      {/* ========== LOGIN MODAL ========== */}
      {showLoginModal && !loggedIn && (
        <div className="login-modal-overlay">
          <div className="login-modal-content">
            <h2 className="sign-in">Sign In</h2>
            <form onSubmit={handleLogin} className="login-form">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="btn login-btn">Sign In</button>
              <p
                className="forgot-password"
                onClick={() => {
                  setShowLoginModal(false);
                  setShowForgotModal(true);
                }}
              >
                Forgot Password?
              </p>
              <p className="register-prompt">
                Don’t have an account?{" "}
                <span
                  onClick={() => {
                    setShowLoginModal(false);
                    setShowRegisterModal(true);
                  }}
                >
                  Create one
                </span>
              </p>
            </form>
            <button className="btn modal-close-btn" onClick={() => setShowLoginModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* ========== FORGOT PASSWORD MODAL ========== */}
      {showForgotModal && (
        <div className="login-modal-overlay">
          <div className="login-modal-content">
            <h2>Reset Password</h2>
            <form onSubmit={handleForgotSubmit} className="login-form">
              <input
                type="email"
                placeholder="Enter your email address"
                required
              />
              <button type="submit" className="btn login-btn">
                Send Reset Link
              </button>
            </form>
            <button
              className="btn modal-close-btn"
              onClick={() => setShowForgotModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ========== REGISTER (CREATE ACCOUNT) MODAL ========== */}
      {showRegisterModal && (
        <div className="login-modal-overlay">
          <div className="login-modal-content">
            <h2>Create Account</h2>
            <form onSubmit={handleRegisterSubmit} className="login-form">
              <input
                type="text"
                placeholder="Username"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
              <button type="submit" className="btn login-btn">
                Sign Up
              </button>
            </form>
            <button
              className="btn modal-close-btn"
              onClick={() => setShowRegisterModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Decor hearts (pinned & raining) */}
      <img src="/puso.png" alt="Heart 1 - Top Left" className="heart-icon heart-icon--top-left" />
      <img src="/puso.png" alt="Heart 2 - Top Right" className="heart-icon heart-icon--top-right" />
      <img src="/puso.png" alt="Heart 3 - Bottom Left" className="heart-icon heart-icon--bottom-left" />
      <img src="/puso.png" alt="Heart 4 - Bottom Right" className="heart-icon heart-icon--bottom-right" />
{/* 
      <img src="/puso.png" alt="Rain Heart 1" className="heart-icon heart-rain heart-rain1" />
      <img src="/puso.png" alt="Rain Heart 2" className="heart-icon heart-rain heart-rain2" />
      <img src="/puso.png" alt="Rain Heart 3" className="heart-icon heart-rain heart-rain3" />
      <img src="/puso.png" alt="Rain Heart 4" className="heart-icon heart-rain heart-rain4" />
      <img src="/puso.png" alt="Rain Heart 5" className="heart-icon heart-rain heart-rain5" /> */}
      {Array.from({ length: 20 }).map((_, i) => (
        <img
          key={i}
          src="/puso.png"
          alt={`Rain Heart ${i + 1}`}
          className={`heart-icon heart-rain heart-rain${i + 1}`}
        />
      ))}

      <div className="hero-content">
        <h1 className="hero-title">
          How <span className="hot-word-neon">Hot</span> Is Your{" "}
          <span className="chat-word">Chat Game?</span>
        </h1>
        <p className="hero-subtitle">
          Upload a convo or paste your messages — Let our AI analyze your chat style,
          flirt power, and vibe score.
        </p>

        {/* Show login button if not logged in */}
        {!loggedIn && (
          <div className="login-button-container">
            <button className="btn login-toggle-btn" onClick={() => setShowLoginModal(true)}>
              Login
            </button>
          </div>
        )}

        {/* Only show Upload + Paste if user is logged in */}
        {loggedIn && (
          <div className="hero-buttons">
            {!freeScanUsed ? (
              <button className="btn btn-upload" onClick={handleUploadClick}>
                Upload Screenshot
              </button>
            ) : (
              <button className="btn btn-upload locked" disabled>
                Upload Locked
              </button>
            )}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            {!freeScanUsed ? (
              <button className="btn btn-paste" onClick={handlePasteClick}>
                Paste Chat Text
              </button>
            ) : (
              <button className="btn btn-paste locked" disabled>
                Paste Locked
              </button>
            )}
          </div>
        )}

        {/* Show the analysis result if we have it, else maybe the paste area */}
        {analysisResult ? (
          <div className="analysis-result-box">
            <h2 className="analysis-result-title">Analysis Result</h2>
            {parsed && (
              <div className="analysis-text">
                <p className="analysis-line">
                  <span className="analysis-label">Likability Score:</span>{" "}
                  <span className="analysis-value">{formatScore(parsed.score)}</span>
                </p>
                <p className="analysis-line">
                  <span className="analysis-label">Tone:</span>{" "}
                  <span className="analysis-value">{parsed.tone}</span>
                </p>
                <p className="analysis-line">
                  <span className="analysis-label">Key Phrases:</span>{" "}
                  <span className="analysis-value">
                    {parsed.keyPhrases.length > 0 ? parsed.keyPhrases.join(", ") : "N/A"}
                  </span>
                </p>
                <p className="analysis-line">
                  <span className="analysis-label">Tips:</span>{" "}
                  <span className="analysis-value">{parsed.tips}</span>
                </p>
              </div>
            )}
            <p className="analysis-highlight">
              Want the perfect line to keep it going?
            </p>
            {onResetAnalysis && (
              <button className="analysis-cta-btn" onClick={handleAnalyzeAnother}>
                Unlock My Next Move — £ 0,99
              </button>
            )}
          </div>
        ) : (
          !freeScanUsed &&
          showTextArea &&
          loggedIn && (
            <div  className="paste-container">
              <textarea
                className="paste-textarea"
                rows="5"
                placeholder="Paste your chat here..."
                value={pastedText}
                onChange={handleTextChange}
              />
              <button className="btn analyze-btn" onClick={handleAnalyzeClick}>
                Analyze Text
              </button>
              {loading && <p className="analyzing-text">Analyzing text...</p>}
            </div>
          )
        )}

        {/* After free scan used, optionally show locked UI */}
        {freeScanUsed && showLockedUI && (
       <div className="locked-ui-container">
       <LockedReply
        token={token}
           triggerPayment={triggerPayment}
          goToPremium={goToPremium}
        triggerUnlock={triggerUnlock}
      />
      </div>
        )}
      </div>
    </section>
  );
}

export default HeroSection;

