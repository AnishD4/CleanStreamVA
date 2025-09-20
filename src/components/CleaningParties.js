import React, { useState, useEffect } from 'react';
import { useReports } from '../context/ReportContext';
import { useEvents } from '../hooks/useEvents';
import { useNotifications } from '../hooks/useNotifications';

const CleaningParties = () => {
  const { verifiedStatuses } = useReports();
  const { events, loading, createEvent, joinEvent, leaveEvent } = useEvents();
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [showUsernameModal, setShowUsernameModal] = useState(true);
  const [activeTab, setActiveTab] = useState('events');
  const [newEvent, setNewEvent] = useState({
    title: '',
    location: '',
    date: '',
    time: '',
    description: '',
    maxParticipants: 20,
    organizer: '',
    contactInfo: ''
  });
  const [showEventForm, setShowEventForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // all, upcoming, past

  // Generate unique user ID
  useEffect(() => {
    if (username && !userId) {
      const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setUserId(id);
    }
  }, [username, userId]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        ...newEvent,
        organizer: username,
        organizerId: userId,
        attendees: [{ userId, userName: username, joinedAt: new Date() }],
        status: 'upcoming'
      };

      await createEvent(eventData);
      
      setNewEvent({
        title: '',
        location: '',
        date: '',
        time: '',
        description: '',
        maxParticipants: 20,
        organizer: '',
        contactInfo: ''
      });
      setShowEventForm(false);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleJoinEvent = async (eventId) => {
    try {
      await joinEvent(eventId, userId, username);
    } catch (error) {
      console.error('Error joining event:', error);
    }
  };

  const handleLeaveEvent = async (eventId) => {
    try {
      await leaveEvent(eventId, userId);
    } catch (error) {
      console.error('Error leaving event:', error);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isUserAttending = (event) => {
    return event.attendees?.some(attendee => attendee.userId === userId);
  };

  const isEventFull = (event) => {
    return event.attendees?.length >= event.maxParticipants;
  };

  const isEventPast = (event) => {
    const eventDateTime = new Date(`${event.date}T${event.time}`);
    return eventDateTime < new Date();
  };

  const filteredEvents = events.filter(event => {
    if (filterStatus === 'upcoming') return !isEventPast(event);
    if (filterStatus === 'past') return isEventPast(event);
    return true;
  });

  if (showUsernameModal) {
    return (
      <div className="username-modal">
        <div className="username-modal-content">
          <h2>🌊 Welcome to Cleaning Events!</h2>
          <p>Enter your name to join the community and organize cleaning events</p>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (username.trim()) {
              setShowUsernameModal(false);
            }
          }}>
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="username-input"
              required
            />
            <button type="submit" className="btn btn-primary">
              Join Community
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <section className="cleaning-parties-section">
      <div className="container">
        <div className="parties-header">
          <h1>🤝 Community Cleaning Events</h1>
          <p>Organize and join cleaning events to protect Virginia's waterways</p>
        </div>

        <div className="events-container">
          <div className="events-header">
            <div className="events-title">
              <h3>📅 Cleaning Events</h3>
              <div className="event-filters">
                <button 
                  className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('all')}
                >
                  All Events
                </button>
                <button 
                  className={`filter-btn ${filterStatus === 'upcoming' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('upcoming')}
                >
                  Upcoming
                </button>
                <button 
                  className={`filter-btn ${filterStatus === 'past' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('past')}
                >
                  Past Events
                </button>
              </div>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => setShowEventForm(true)}
            >
              <i className="fas fa-plus"></i>
              Create Event
            </button>
          </div>

          {showEventForm && (
            <div className="event-form-modal">
              <div className="event-form-content">
                <div className="form-header">
                  <h3>Create New Cleaning Event</h3>
                  <button 
                    className="close-btn"
                    onClick={() => setShowEventForm(false)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <form onSubmit={handleCreateEvent}>
                  <div className="form-group">
                    <label>Event Title *</label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      placeholder="e.g., Lake Anna Cleanup"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Location *</label>
                    <select
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                      required
                    >
                      <option value="">Select a water body</option>
                      {Object.keys(verifiedStatuses).map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Date *</label>
                      <input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Time *</label>
                      <input
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      placeholder="Describe the cleanup activities, what to bring, meeting point, etc..."
                      rows="4"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Max Participants</label>
                      <input
                        type="number"
                        value={newEvent.maxParticipants}
                        onChange={(e) => setNewEvent({...newEvent, maxParticipants: parseInt(e.target.value)})}
                        min="1"
                        max="100"
                      />
                    </div>
                    <div className="form-group">
                      <label>Contact Info</label>
                      <input
                        type="text"
                        value={newEvent.contactInfo}
                        onChange={(e) => setNewEvent({...newEvent, contactInfo: e.target.value})}
                        placeholder="Phone or email"
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="button" onClick={() => setShowEventForm(false)} className="btn btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Create Event
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {loading ? (
            <div className="loading-container">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading events...</p>
            </div>
          ) : (
            <div className="events-list">
              {filteredEvents.length === 0 ? (
                <div className="no-events">
                  <i className="fas fa-calendar-plus"></i>
                  <h4>No events found</h4>
                  <p>
                    {filterStatus === 'upcoming' 
                      ? "No upcoming events. Be the first to create one!"
                      : filterStatus === 'past'
                      ? "No past events yet."
                      : "No events yet. Be the first to create a cleaning event!"
                    }
                  </p>
                </div>
              ) : (
                filteredEvents.map(event => {
                  const userAttending = isUserAttending(event);
                  const eventFull = isEventFull(event);
                  const eventPast = isEventPast(event);
                  
                  return (
                    <div key={event.id} className={`event-card ${eventPast ? 'past-event' : ''}`}>
                      <div className="event-header">
                        <div className="event-title-section">
                          <h4>{event.title}</h4>
                          <div className="event-status-badges">
                            {eventPast && <span className="status-badge past">Past Event</span>}
                            {eventFull && !eventPast && <span className="status-badge full">Full</span>}
                            {!eventPast && !eventFull && <span className="status-badge upcoming">Upcoming</span>}
                          </div>
                        </div>
                        <div className="event-participants">
                          <i className="fas fa-users"></i>
                          <span>{event.attendees?.length || 0}/{event.maxParticipants}</span>
                        </div>
                      </div>
                      
                      <div className="event-details">
                        <div className="event-info">
                          <i className="fas fa-map-marker-alt"></i>
                          <span>{event.location}</span>
                        </div>
                        <div className="event-info">
                          <i className="fas fa-calendar"></i>
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="event-info">
                          <i className="fas fa-clock"></i>
                          <span>{event.time}</span>
                        </div>
                        <div className="event-info">
                          <i className="fas fa-user"></i>
                          <span>Organized by {event.organizer}</span>
                        </div>
                      </div>
                      
                      {event.description && (
                        <div className="event-description">
                          <p>{event.description}</p>
                        </div>
                      )}
                      
                      {event.contactInfo && (
                        <div className="event-contact">
                          <i className="fas fa-phone"></i>
                          <span>Contact: {event.contactInfo}</span>
                        </div>
                      )}
                      
                      <div className="attendees-list">
                        <h5>Attendees ({event.attendees?.length || 0})</h5>
                        <div className="attendees-grid">
                          {event.attendees?.map((attendee, index) => (
                            <div key={index} className="attendee-item">
                              <i className="fas fa-user-circle"></i>
                              <span>{attendee.userName}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="event-actions">
                        {!eventPast && (
                          <>
                            {userAttending ? (
                              <button 
                                className="btn btn-danger"
                                onClick={() => handleLeaveEvent(event.id)}
                              >
                                <i className="fas fa-times"></i>
                                Leave Event
                              </button>
                            ) : (
                              <button 
                                className="btn btn-primary"
                                onClick={() => handleJoinEvent(event.id)}
                                disabled={eventFull}
                              >
                                <i className="fas fa-check"></i>
                                {eventFull ? 'Event Full' : 'Join Event'}
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CleaningParties;
