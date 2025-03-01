import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { usePatient } from '../contexts/PatientContext';
import { findMatchingFacility } from '../services/facilityService';
import { Facility } from '../types';

export default function Results() {
  const { patientName, careType, zipCode, resetState } = usePatient();
  const [isLoading, setIsLoading] = useState(true);
  const [matchedFacility, setMatchedFacility] = useState<Facility | null>(null);
  const [noMatch, setNoMatch] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Redirect if data is missing
    if (!patientName || !careType) {
      router.push('/patient-name');
      return;
    }

    const getMatchingFacility = async () => {
      setIsLoading(true);
      try {
        console.log(careType, zipCode, "getting the matching facility")
        const result = await findMatchingFacility(careType, zipCode);
        if (result.success && result.facility) {
          setMatchedFacility(result.facility);
          setNoMatch(false);
        } else {
          setNoMatch(true);
          setErrorMessage(result.message || "We couldn't find a suitable facility for your requirements.");
        }
      } catch (error) {
        console.error('Error finding facility match:', error);
        setNoMatch(true);
        setErrorMessage('An error occurred while finding a facility. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    getMatchingFacility();
  }, [patientName, careType, zipCode, router]);

  const handleReset = () => {
    // Clear stored data
    resetState();
    
    // Redirect to home page
    router.push('/');
  };

  const getFacilityType = (facility: Facility) => {
    const types = [];
    if (facility.stationary) types.push('Stationary');
    if (facility.ambulatory) types.push('Ambulatory');
    if (facility.daycare) types.push('Day Care');
    return types.join(' & ');
  };

  return (
    <div className="page-container">
      <div className="card-container">
        <h1 className="card-title">Results</h1>
        
        <div className="info-section">
          <h2 className="section-title">Patient Information</h2>
          <p className="info-item"><span className="info-label">Name:</span> {patientName}</p>
          <p className="info-item"><span className="info-label">Care Type:</span> {careType.charAt(0).toUpperCase() + careType.slice(1)}</p>
          {careType !== 'daycare' && <p className="info-item"><span className="info-label">Zip Code:</span> {zipCode}</p>}
        </div>
        
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : noMatch ? (
          <div className="result-box result-warning">
            <h2 className="section-title">No Match Found</h2>
            <p>{errorMessage}</p>
            <p className="result-hint">
              Please try again with different criteria or contact our support team for assistance.
            </p>
          </div>
        ) : matchedFacility && (
          <div className="result-box result-success">
            <h2 className="section-title">Matched Facility</h2>
            <p className="info-item"><span className="info-label">Facility:</span> {matchedFacility.facility}</p>
            <p className="info-item"><span className="info-label">Type:</span> {getFacilityType(matchedFacility)}</p>
            <p className="info-item"><span className="info-label">Zip Code:</span> {matchedFacility.zip_code}</p>
            <p className="info-item"><span className="info-label">Serves:</span> {matchedFacility.zip_code_min} - {matchedFacility.zip_code_max}</p>
            <p className="result-success-message">
              This facility has capacity and is ready to serve you!
            </p>
          </div>
        )}
        
        <div className="button-group">
          <button
            onClick={() => router.push('/care-selection')}
            className="button-secondary"
          >
            Back
          </button>
          <button
            onClick={handleReset}
            className="button-primary"
          >
            New Search
          </button>
        </div>
      </div>
    </div>
  );
}