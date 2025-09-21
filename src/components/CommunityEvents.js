import React, { useState } from 'react';
import { useEvents } from '../hooks/useEvents';

const CommunityEvents = () => {
  const { events, loading, error, createEvent, updateEvent } = useEvents();
  const [form, setForm] = useState({ title: '', description: '', location: '', date: '' });
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    await createEvent({ ...form, approved: false });
    setForm({ title: '', description: '', location: '', date: '' });
    setSubmitting(false);
  };

  const handleApprove = async (eventId) => {
    await updateEvent(eventId, { approved: true });
  };

  // Filter logic: show only upcoming/current events unless searching
  const now = new Date();
  const filteredEvents = events.filter(event => {
    const eventDate = event.date ? new Date(event.date) : null;
    const matchesSearch = search && (
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase())
    );
    if (search) {
      // If searching, show all matching events (including past)
      return matchesSearch;
    }
    // Otherwise, show only events today or in the future
    return eventDate && eventDate >= now;
  });

  return (
    <section className="community-events-section card">
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
          type="date"
          name="date"
          placeholder="Date"
          value={form.date}
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
        <button type="submit" disabled={submitting} className="btn">Submit Event</button>
      </form>
      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 16, padding: 8, width: '100%' }}
      />
      {loading && <p>Loading events...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredEvents.map(event => (
          <li key={event.id} className="event-card" style={{ marginBottom: 16, border: '1px solid #eee', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 16, background: '#fff' }}>
            <strong>{event.title}</strong> <br />
            <span>{event.location}</span> <br />
            <span>{event.description}</span> <br />
            <span>Date: {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}</span> <br />
            <span>Status: {event.approved ? 'Approved' : 'Pending'}</span> <br />
            {!event.approved && (
              <button onClick={() => handleApprove(event.id)} className="btn">Approve</button>
            )}
          </li>
        ))}
        {filteredEvents.length === 0 && <li>No events found.</li>}
      </ul>
    </section>
  );
};

export default CommunityEvents;
