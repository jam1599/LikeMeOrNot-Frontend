// UploadForm.js
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const UploadForm = ({ onExtractText }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type === 'image/jpeg' ||
       file.type === 'image/png' ||
       file.type === 'image/heic')
    ) {
      setSelectedFile(file);
      setError('');
    } else {
      setError('Invalid file format. Only JPG, PNG, and HEIC are allowed.');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      const result = await Tesseract.recognize(selectedFile, 'eng');
      onExtractText(result.data.text);
    } catch (err) {
      console.error("OCR error:", err);
      setError('Error processing image.');
    }
  };

  return (
    <div>
      <h2>Upload Screenshot</h2>
      <input
        type="file"
        accept="image/jpeg, image/png, image/heic"
        onChange={handleFileChange}
      />
      <br />
      <button onClick={handleUpload}>Process Image</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default UploadForm;
