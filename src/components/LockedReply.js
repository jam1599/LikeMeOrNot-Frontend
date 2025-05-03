// LockedReply.js
import React from "react";
import "./LockedReply.css";
import { loadStripe } from "@stripe/stripe-js";  // Import Stripe.js

// Initialize Stripe with your live or test publishable key.
// const stripePromise = loadStripe("pk_test_51QmxXNPqcp3jD0diXZgV5rEafhQarXnFPDxxmk9ykMOKikRbAiqUh7IyJbgjWvF3c2w1uuno1IvI8wlHUVLxas6a00JZiwucx7");
const stripePromise = loadStripe("pk_live_51QmxXHLIfxI8v49WklmwIPbZsneDNa1cK2YuEVBDNGFcNphXi5PrxFGMK9sUE9ilG1hUyWScTDUV8JvjUM5YperD00LFcjDWCY");

function LockedReply(props) {
  // Try to get JWT from props, fallback to localStorage
  // let token = props.token;
  let token = props.token || localStorage.getItem("token");
  if (!token) {
    token = localStorage.getItem("token");
  }

  /**
   * Calls backend to create a one-time Checkout Session for £0.99.
   * Then redirects to Stripe Checkout.
   */
  const handleOneTimePayment = async () => {
    const stripe = await stripePromise;

    // 1) Create the session on your backend
    // const resp = await fetch("http://localhost:8000/create-checkout-session", {
      const resp = await fetch("https://likemeornot-backend.onrender.com/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),   // include JWT
      },
    });

    if (!resp.ok) {
      console.error("Backend returned", resp.status, await resp.text());
      return;
    }

    const { sessionId } = await resp.json();
    if (!sessionId) {
      console.error("No sessionId in response", await resp.json());
      return;
    }

    // 2) Redirect to Stripe
    const result = await stripe.redirectToCheckout({ sessionId });
    if (result.error) console.error(result.error.message);
  };


  /**
   * Calls backend to create a subscription Checkout Session for £4.99/month.
   * Then redirects to Stripe Checkout.
   */
  const handleSubscriptionPayment = async () => {
    const stripe = await stripePromise;

    // 1) Create the session on your backend
    // const resp = await fetch("http://localhost:8000/create-subscription-session", {
      const resp = await fetch("https://likemeornot-backend.onrender.com/create-subscription-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),  // include JWT here too
      },
    });

    if (!resp.ok) {
      console.error("Backend returned", resp.status, await resp.text());
      return;
    }

    const { sessionId } = await resp.json();
    if (!sessionId) {
      console.error("No sessionId in response", await resp.json());
      return;
    }

    // 2) Redirect to Stripe
    const result = await stripe.redirectToCheckout({ sessionId });
    if (result.error) console.error(result.error.message);
  };

  return (
    <div className="locked-reply">
      <p className="locked-message">This reply is locked.</p>
      <p>Unlock the full AI-crafted response now:</p>

      {/* One-time payment for £0.99 */}
      <button className="unlock-btn" onClick={handleOneTimePayment}>
        Unlock for £0.99
      </button>

      <p className="or-text">or</p>

      {/* Monthly subscription for £4.99 */}
      <button className="premium-btn" onClick={handleSubscriptionPayment}>
        Get Unlimited Access - £4.99/month
      </button>
    </div>
  );
}

export default LockedReply;
