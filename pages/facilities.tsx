import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Facility } from "../types";
import styles from "../styles/facilities.module.css";

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFacilities() {
      try {
        setLoading(true);
        
        // Query facilities directly from Supabase
        const { data, error } = await supabase
          .from('facilities')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setFacilities(data);
        }
      } catch (err) {
        // Use a more specific error type
        const errorMessage = err instanceof Error 
          ? err.message 
          : typeof err === 'string' 
            ? err 
            : "Failed to fetch facilities.";
        
        console.error("Error fetching facilities:", err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchFacilities();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Participating Facilities</h1>
      
      {loading && <p className={styles.loadingText}>Loading facilities...</p>}
      {error && <p className={styles.errorText}>{error}</p>}
      
      {!loading && facilities.length === 0 && !error && (
        <p className={styles.emptyText}>No facilities found.</p>
      )}
      
      <div className={styles.grid}>
        {facilities.map((facility) => (
          <div key={facility.facility} className={styles.card}>
            <h2 className={styles.cardTitle}>{facility.facility}</h2>
            <div className={styles.infoContainer}>
              <p>
                <span className={styles.label}>Zip Code:</span> {facility.zip_code}
              </p>
              <p>
                <span className={styles.label}>Service Area:</span> {facility.zip_code_min} - {facility.zip_code_max}
              </p>
              <p>
                <span className={styles.label}>Capacity:</span>{" "}
                {facility.capacity ? (
                  <span className={styles.available}>Available</span>
                ) : (
                  <span className={styles.full}>Full</span>
                )}
              </p>
              <p>
                <span className={styles.label}>Services:</span> {(
                  [facility.stationary && 'Stationary', facility.ambulatory && 'Ambulatory']
                  .filter(Boolean) // Filter out undefined values
                ).join(', ')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}