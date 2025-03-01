// contexts/PatientContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type CareType = 'stationary' | 'ambulatory' | 'daycare';

interface PatientContextType {
  patientName: string;
  setPatientName: (name: string) => void;
  careType: CareType;
  setCareType: (type: CareType) => void;
  zipCode: string;
  setZipCode: (zip: string) => void;
  resetState: () => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patientName, setPatientName] = useState<string>('');
  const [careType, setCareType] = useState<CareType>('stationary');
  const [zipCode, setZipCode] = useState<string>('');

  const resetState = () => {
    setPatientName('');
    setCareType('stationary');
    setZipCode('');
  };

  return (
    <PatientContext.Provider
      value={{
        patientName,
        setPatientName,
        careType,
        setCareType,
        zipCode,
        setZipCode,
        resetState
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}

// Custom hook to use the patient context
export function usePatient() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
}