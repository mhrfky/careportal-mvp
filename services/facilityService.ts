import { supabase } from '../lib/supabaseClient';
import { CareType, Facility, MatchResult } from '../types';

// Debug utility to check Supabase connection and table structure
export async function checkSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  try {
    // Test connection with a simple query
    const { data, error } = await supabase
      .from('facilities')
      .select('*');
    
    if (error) {
      return {
        success: false,
        message: `Supabase error: ${error.message}`,
      };
    }
    
    return {
      success: true,
      message: 'Connection successful',
      data: data
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Connection error: ${err.message || 'Unknown error'}`,
    };
  }
}

export async function findMatchingFacility(
    careType: CareType,
    zipCode: string
  ): Promise<MatchResult> {
    // Early return for day care (no matching facilities)
    if (careType === 'daycare') {
      return {
        success: false,
        message: 'Day care facilities are not available in the current version of CarePortal.'
      };
    }
  
    const zipCodeNum = parseInt(zipCode);
    
    try {
      // Get all facilities matching the care type in a single query
      let { data: facilities, error } = await supabase
        .from('facilities')
        .select('*')
        .eq(careType, true);
      
      if (error) throw error;
      
      if (!facilities || facilities.length === 0) {
        return {
          success: false,
          message: `No ${careType} facilities found in our system.`
        };
      }
      
      // Separate facilities into "in range" and "out of range"
      const inRangeFacilities = facilities.filter(
        facility => zipCodeNum >= facility.zip_code_min && zipCodeNum <= facility.zip_code_max
      );
      
      let candidateFacilities: Facility[] = [];
      
      // First priority: in-range facilities with capacity
      const inRangeWithCapacity = inRangeFacilities.filter(
        facility => facility.capacity === true
      );
      
      if (inRangeWithCapacity.length > 0) {
        // Sort by distance to patient's zip
        candidateFacilities = inRangeWithCapacity.sort((a, b) => {
          return Math.abs(a.zip_code - zipCodeNum) - Math.abs(b.zip_code - zipCodeNum);
        });
        
        return {
          success: true,
          facility: candidateFacilities[0]
        };
      }
      
      // If no in-range facilities with capacity, check all facilities by distance
      // Sort all facilities by distance
      const sortedByDistance = facilities.sort((a, b) => {
        return Math.abs(a.zip_code - zipCodeNum) - Math.abs(b.zip_code - zipCodeNum);
      });
      
      // Check if nearest is too far away
      if (Math.abs(sortedByDistance[0].zip_code - zipCodeNum) > 3000) {
        return {
          success: false,
          message: 'All facilities are too far from your location.'
        };
      }
      
      // Find the closest facility with capacity
      const closestWithCapacity = sortedByDistance.find(
        facility => facility.capacity === true
      );
      
      if (closestWithCapacity) {
        return {
          success: true,
          facility: closestWithCapacity
        };
      }
      
      // No facilities with capacity
      return {
        success: false,
        message: 'All suitable facilities are currently at full capacity.'
      };
      
    } catch (err: any) {
      console.error('Error finding matching facility:', err);
      return {
        success: false,
        message: `Database error: ${err.message || 'Unknown error'}`
      };
    }
  }