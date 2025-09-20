import React, { useState } from 'react';
import { useReports } from '../context/ReportContext';
import VerificationInfo from './VerificationInfo';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Determine status based on water condition
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
        waterCondition: formData.waterCondition,
        smell: formData.smell,
        description: formData.description,
        contact: formData.contact,
        status: getStatusFromCondition(formData.waterCondition)
      };

      // Add report to context
      addReport(reportData);

      // Get verification status for this location
      const verificationStatus = getVerificationStatus(formData.location);
      
      console.log('Report submitted:', reportData);
      console.log('Verification status:', verificationStatus);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success notification with verification info
      const message = verificationStatus.isVerified 
        ? `Thank you for your report! Status for ${formData.location} has been verified and updated.`
        : `Thank you for your report! We need ${verificationStatus.neededReports - verificationStatus.totalReports} more reports to verify the status for ${formData.location}.`;
      
      onReportSubmit(message, 'success');

      // Reset form
      setFormData({
        location: '',
        waterCondition: '',
        smell: '',
        description: '',
        contact: ''
      });

    } catch (error) {
      console.error('Error submitting report:', error);
      onReportSubmit('There was an error submitting your report. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="report-section">
      <div className="container">
        <h2>Report Water Quality Issues</h2>
        <p>Help protect Virginia's waterways by reporting water quality observations</p>
        
        <VerificationInfo />
        
        <form className="report-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="location">Location *</label>
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
                // Handle file upload in a real application
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
