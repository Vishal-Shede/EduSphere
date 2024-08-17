import React, { createContext, useReducer, useContext, useEffect } from 'react';
import axios from 'axios';

// Create the EventContext
const EventContext = createContext();

// Define action types
const FETCH_EVENTS_SUCCESS = 'FETCH_EVENTS_SUCCESS';
const ADD_EVENT = 'ADD_EVENT';

// Define the initial state
const initialState = {
  events: [],
};

// Create a reducer function
const eventReducer = (state, action) => {
  switch (action.type) {
    case FETCH_EVENTS_SUCCESS:
      return {
        ...state,
        events: action.payload,
      };
    case ADD_EVENT:
      return {
        ...state,
        events: [...state.events, action.payload],
      };
    default:
      return state;
  }
};

// EventProvider component to wrap around the app
export const EventProvider = ({ children }) => {
  const [state, dispatch] = useReducer(eventReducer, initialState);

  // Fetch events from the API
  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/v1/events');
      dispatch({
        type: FETCH_EVENTS_SUCCESS,
        payload: res.data.data,
      });
    } catch (error) {
      console.error('Failed to fetch events:', error.response.data);
    }
  };

  // Add a new event
  const addEvent = async (eventData) => {
    try {
      const res = await axios.post('/api/v1/events', eventData);
      dispatch({
        type: ADD_EVENT,
        payload: res.data.data,
      });
    } catch (error) {
      console.error('Failed to add event:', error.response.data);
    }
  };

  // Fetch events when the component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <EventContext.Provider value={{ ...state, fetchEvents, addEvent }}>
      {children}
    </EventContext.Provider>
  );
};

// Custom hook to use the EventContext
export const useEvent = () => {
  return useContext(EventContext);
};
