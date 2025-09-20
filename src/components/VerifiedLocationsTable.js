import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';

const VerifiedLocationsTable = () => {
  const [verifiedLocations, setVerifiedLocations] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'verifiedLocations'), (snapshot) => {
      setVerifiedLocations(snapshot.docs.map(doc => doc.data()));
    });
    return () => unsub();
  }, []);

  return (
    <section className="verified-table-section">
      <div className="container">
        <h2>Verified Water Locations</h2>
        <table className="verified-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Location</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Status</th>
              <th>Verified At</th>
            </tr>
          </thead>
          <tbody>
            {verifiedLocations.length === 0 ? (
              <tr><td colSpan={5}>No verified locations yet.</td></tr>
            ) : (
              verifiedLocations.map((loc, idx) => (
                <tr key={idx}>
                  <td>{loc.location}</td>
                  <td>{loc.coords?.lat?.toFixed(5)}</td>
                  <td>{loc.coords?.lon?.toFixed(5)}</td>
                  <td>{loc.status}</td>
                  <td>{new Date(loc.verifiedAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default VerifiedLocationsTable;

