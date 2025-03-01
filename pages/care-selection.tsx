// pages/care-selection.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { usePatient } from '../contexts/PatientContext';

type CareType = 'stationary' | 'ambulatory' | 'daycare';

export default function CareSelection() {
  const { patientName, careType, setCareType, zipCode, setZipCode } = usePatient();
  const router = useRouter();

  // Redirect if no patient name is set
  useEffect(() => {
    if (!patientName) {
      router.push('/patient-name');
    }
  }, [patientName, router]);

  // Handle care type change
  const handleCareTypeChange = (type: CareType) => {
    setCareType(type);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Navigate to results page
    router.push('/results');
  };

  // Determine if zip code input should be disabled
  const isZipDisabled = careType === 'daycare';

  return (
    <div className="page-container">
      <div className="card-container">
        <h1 className="card-title">Care Selection</h1>
        
        <p className="card-description">
          Hello, <span style={{ fontWeight: 600 }}>{patientName}</span>! Please select the type of care you need.
        </p>
        
        <form onSubmit={handleSubmit} className="patient-form">
          <div className="form-group">
            <label className="form-label">
              Type of Care
            </label>
            <div className="radio-group">
              <div className="radio-option">
                <input
                  id="stationary"
                  name="careType"
                  type="radio"
                  checked={careType === 'stationary'}
                  onChange={() => handleCareTypeChange('stationary')}
                  className="radio-input"
                />
                <label htmlFor="stationary" className="radio-label">
                  Stationary Care
                </label>
              </div>
              <div className="radio-option">
                <input
                  id="ambulatory"
                  name="careType"
                  type="radio"
                  checked={careType === 'ambulatory'}
                  onChange={() => handleCareTypeChange('ambulatory')}
                  className="radio-input"
                />
                <label htmlFor="ambulatory" className="radio-label">
                  Ambulatory Care
                </label>
              </div>
              <div className="radio-option">
                <input
                  id="daycare"
                  name="careType"
                  type="radio"
                  checked={careType === 'daycare'}
                  onChange={() => handleCareTypeChange('daycare')}
                  className="radio-input"
                />
                <label htmlFor="daycare" className="radio-label">
                  Day Care
                </label>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <div className="zip-code-container">
              <label 
                className={`form-label ${isZipDisabled ? 'text-disabled' : ''}`}
                htmlFor="zipCode"
              >
                Zip Code
              </label>
              {isZipDisabled && (
                <div className="unavailable-badge" title="Zip code not required for Day Care">
                  Not Required
                </div>
              )}
            </div>
            <div className="zip-input-container">
              <input
                id="zipCode"
                type="text"
                value={isZipDisabled ? '' : zipCode}
                onChange={(e) => !isZipDisabled && setZipCode(e.target.value.replace(/\D/g, ''))}
                className={`form-input ${isZipDisabled ? 'input-disabled' : ''}`}
                placeholder={isZipDisabled ? "Not required for Day Care" : "Enter your zip code"}
                pattern="[0-9]{5}"
                maxLength={5}
                disabled={isZipDisabled}
                required={!isZipDisabled}
              />
              {isZipDisabled && (
                <div className="tooltip">
                  Day Care is available at all locations without zip code restriction
                </div>
              )}
            </div>
            {!isZipDisabled && (
              <p className="form-hint">
                Please enter a 5-digit zip code
              </p>
            )}
          </div>
          
          <div className="button-group">
            <button
              onClick={() => router.push('/patient-name')}
              type="button"
              className="button-secondary"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!isZipDisabled && zipCode.length !== 5}
              className="button-primary"
            >
              Find Facilities
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}