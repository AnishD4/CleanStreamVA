import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, 'events'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const eventsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventsData);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const createEvent = async (eventData) => {
    try {
      const docRef = await addDoc(collection(db, 'events'), {
        ...eventData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const updateEvent = async (eventId, eventData) => {
    try {
      await updateDoc(doc(db, 'events', eventId), {
        ...eventData,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await deleteDoc(doc(db, 'events', eventId));
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const joinEvent = async (eventId, userId, userName) => {
    try {
      const event = events.find(e => e.id === eventId);
      if (!event) throw new Error('Event not found');

      const updatedAttendees = [...(event.attendees || []), { userId, userName, joinedAt: new Date() }];
      
      await updateDoc(doc(db, 'events', eventId), {
        attendees: updatedAttendees,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const leaveEvent = async (eventId, userId) => {
    try {
      const event = events.find(e => e.id === eventId);
      if (!event) throw new Error('Event not found');

      const updatedAttendees = (event.attendees || []).filter(attendee => attendee.userId !== userId);
      
      await updateDoc(doc(db, 'events', eventId), {
        attendees: updatedAttendees,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    joinEvent,
    leaveEvent
  };
};
