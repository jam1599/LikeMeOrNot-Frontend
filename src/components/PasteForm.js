// PasteForm.js
import React, { useState } from "react";

const PasteForm = ({ onSubmitText }) => {
  const [textInput, setTextInput] = useState("");

  const handleSubmit = () => {
    if (textInput.trim()) {
      onSubmitText(textInput);
    }
  };

  return (
    <div className="paste-form">
      <h2>Paste Chat Text</h2>
      <textarea
        rows="6"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        placeholder="Paste your chat here..."
      />
      <br />
      <button onClick={handleSubmit}>Analyze Text</button>
    </div>
  );
};

export default PasteForm;
