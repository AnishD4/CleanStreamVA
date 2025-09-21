import React, { useState } from 'react';
import { useReports } from '../context/ReportContext';
import VerificationInfo from './VerificationInfo';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const defaultPosition = [37.5407, -78.6569]; // Virginia center

function LocationPicker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    }
  });
  return position ? <Marker position={position} /> : null;
}

const ReportForm = ({ onReportSubmit }) => {
  const { addReport, getVerificationStatus } = useReports();
  const [formData, setFormData] = useState({
    location: '',
    waterCondition: '',
    smell: '',
    description: '',
    contact: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [position, setPosition] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    // Validation: require location, waterCondition, description, position
    if (!formData.location || !formData.waterCondition || !formData.description || !position) {
      setErrorMsg('Please fill in all required fields and pick a location on the map.');
      setIsSubmitting(false);
      return;
    }
    try {
      const getStatusFromCondition = (condition) => {
        switch (condition) {
          case 'clear': return 'safe';
          case 'greenish': return 'caution';
          case 'algae': return 'warning';
          case 'foam': return 'warning';
          case 'discolored': return 'caution';
          default: return 'safe';
        }
      };
      const reportData = {
        location: formData.location,
        coords: { lat: position[0], lon: position[1] },
        waterCondition: formData.waterCondition,
        description: formData.description,
        status: getStatusFromCondition(formData.waterCondition),
        timestamp: Date.now()
      };
      if (formData.smell) reportData.smell = formData.smell;
      if (formData.contact) reportData.contact = formData.contact;
      await addReport(reportData);
      if (onReportSubmit) onReportSubmit('Report submitted!', 'success');
      setFormData({ location: '', waterCondition: '', smell: '', description: '', contact: '' });
      setPosition(null);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit report.');
      if (onReportSubmit) onReportSubmit(err.message || 'Failed to submit report.', 'error');
    }
    setIsSubmitting(false);
  };

  return (
    <section className="report-section">
      <div className="container">
        <h2>Report Water Quality Issues</h2>
        <p>Help protect Virginia's waterways by reporting water quality observations</p>
        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
        <VerificationInfo />
        <form className="report-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="location">Location Name *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter water body name or address"
              required
            />
          </div>
          <div className="form-group">
            <label>Pick Location on Map *</label>
            <div style={{ height: '300px', marginBottom: '12px' }}>
              <MapContainer center={defaultPosition} zoom={7} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker position={position} setPosition={setPosition} />
              </MapContainer>
            </div>
            {position && <div>Selected: {position[0].toFixed(5)}, {position[1].toFixed(5)}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="waterCondition">Water Condition *</label>
            <select
              id="waterCondition"
              name="waterCondition"
              value={formData.waterCondition}
              onChange={handleChange}
              required
            >
              <option value="">Select condition</option>
              <option value="clear">Clear/Normal</option>
              <option value="greenish">Greenish tint</option>
              <option value="algae">Visible algae</option>
              <option value="foam">Foam or scum</option>
              <option value="discolored">Discolored water</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="smell">Odor</label>
            <select
              id="smell"
              name="smell"
              value={formData.smell}
              onChange={handleChange}
            >
              <option value="">No unusual odor</option>
              <option value="earthy">Earthy/musty</option>
              <option value="fishy">Fishy</option>
              <option value="chemical">Chemical</option>
              <option value="rotten">Rotten eggs</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="description">Additional Details</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe what you observed..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="photo">Photo (optional)</label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={(e) => {
                console.log('Photo selected:', e.target.files[0]);
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="contact">Contact Email (optional)</label>
            <input
              type="email"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="your@email.com"
            />
          </div>
          <button
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ReportForm;
