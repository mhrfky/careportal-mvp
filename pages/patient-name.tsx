// pages/patient-name.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { usePatient } from '../contexts/PatientContext';

export default function PatientName() {
  const [name, setName] = useState('');
  const { patientName, setPatientName } = usePatient();
  const router = useRouter();
  
  // Pre-fill the form if we have existing data
  useEffect(() => {
    if (patientName) {
      setName(patientName);
    }
  }, [patientName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim()) {
      // Save name to context
      setPatientName(name);
      
      // Move to next step
      router.push('/care-selection');
    }
  };

  return (
    <div className="page-container">
      <div className="card-container">
        <h1 className="card-title">Patient Information</h1>
        
        <form onSubmit={handleSubmit} className="patient-form">
          <div className="form-group">
            <label 
              className="form-label" 
              htmlFor="name"
            >
              Patient Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="button-group">
            <button
              onClick={() => router.push('/')}
              type="button"
              className="button-secondary"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="button-primary"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}