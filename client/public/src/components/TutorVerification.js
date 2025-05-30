import React, { useState } from 'react';
import axios from 'axios';

function TutorVerification({ tutorId }) {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');

  const uploadDoc = async () => {
    if (!file) return setMsg('Please select a file.');
    const formData = new FormData();
    formData.append('doc', file);
    try {
      await axios.post(`/api/tutor/upload-doc/${tutorId}`, formData);
      setMsg('Document uploaded! Await admin approval.');
    } catch (err) {
      setMsg('Upload failed.');
    }
  };

  return (
    <div>
      <h3>Verification</h3>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={uploadDoc}>Upload Document</button>
      <div>{msg}</div>
    </div>
  );
}

export default TutorVerification;
