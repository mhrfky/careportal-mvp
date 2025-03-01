// types/index.ts
export interface Facility {
    facility: string;
    stationary: boolean;
    ambulatory: boolean;
    daycare: boolean;
    zip_code_min: number;
    zip_code_max: number;
    zip_code: number;
    capacity: boolean; // true means available
  }
  
  export type CareType = 'stationary' | 'ambulatory' | 'daycare';
  
  export interface MatchResult {
    success: boolean;
    facility?: Facility;
    message?: string;
  }