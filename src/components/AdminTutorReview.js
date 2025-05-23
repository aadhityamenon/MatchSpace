import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminTutorReview() {
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    axios.get('/api/tutor/all') // Adjust if your route is different
      .then(res => setTutors(res.data));
  }, []);

  const handleApprove = async (tutorId) => {
    await axios.post(`/api/tutor/verify/${tutorId}`);
    setTutors(tutors.map(t => t._id === tutorId ? { ...t, verified: true } : t));
  };

  const handleReject = async (tutorId) => {
    await axios.post(`/api/tutor/reject/${tutorId}`);
    setTutors(tutors.map(t => t._id === tutorId ? { ...t, verified: false } : t));
  };

  return (
    <div>
      <h2>Pending Tutor Verifications</h2>
      {tutors.filter(t => !t.verified && t.verificationDocs.length > 0).map(tutor => (
        <div key={tutor._id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
          <p>Name: {tutor.name}</p>
          <p>Email: {tutor.email}</p>
          <div>
            {tutor.verificationDocs.map((doc, i) => (
              <a key={i} href={`/${doc}`} target="_blank" rel="noopener noreferrer">View Document {i+1}</a>
            ))}
          </div>
          <button onClick={() => handleApprove(tutor._id)}>Approve</button>
          <button onClick={() => handleReject(tutor._id)}>Reject</button>
        </div>
      ))}
    </div>
  );
}

export default AdminTutorReview;
