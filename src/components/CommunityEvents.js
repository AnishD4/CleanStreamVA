import React, { useState } from 'react';
import { useEvents } from '../hooks/useEvents';

const CommunityEvents = () => {
  const { events, loading, error, createEvent, updateEvent } = useEvents();
  const [form, setForm] = useState({ title: '', description: '', location: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    await createEvent({ ...form, approved: false });
    setForm({ title: '', description: '', location: '' });
    setSubmitting(false);
  };

  const handleApprove = async (eventId) => {
    await updateEvent(eventId, { approved: true });
  };

  return (
    <section className="community-events-section">
      <h2>Community Events</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={form.title}
          onChange={handleChange}
          required
          style={{ marginRight: 8 }}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
          style={{ marginRight: 8 }}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          style={{ marginRight: 8 }}
        />
        <button type="submit" disabled={submitting}>Submit Event</button>
      </form>
      {loading && <p>Loading events...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      <ul>
        {events.map(event => (
          <li key={event.id} style={{ marginBottom: 16, border: '1px solid #ccc', padding: 8 }}>
            <strong>{event.title}</strong> <br />
            <span>{event.location}</span> <br />
            <span>{event.description}</span> <br />
            <span>Status: {event.approved ? 'Approved' : 'Pending'}</span> <br />
            {!event.approved && (
              <button onClick={() => handleApprove(event.id)}>Approve</button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CommunityEvents;

