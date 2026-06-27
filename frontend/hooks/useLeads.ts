import { useEffect, useState } from 'react';
import axios from 'axios';
import type { CalendarEvent, Lead } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * useLeads - Custom hook for fetching leads with skeleton loading state
 * Includes Socket.io integration for real-time updates
 */
export const useLeads = (autoRefresh = true, refreshInterval = 5000) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<Lead[]>(`${API_BASE_URL}/leads`, {
          timeout: 10000,
        });
        setLeads(response.data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leads');
        console.error('Error fetching leads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();

    if (autoRefresh) {
      const interval = setInterval(fetchLeads, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  return { leads, loading, error };
};

/**
 * useMetrics - Custom hook for fetching dashboard metrics
 */
export const useMetrics = (autoRefresh = true, refreshInterval = 8000) => {
  const [metrics, setMetrics] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<unknown>(`${API_BASE_URL}/metrics`, {
          timeout: 10000,
        });
        setMetrics(response.data || null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
        console.error('Error fetching metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();

    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  return { metrics, loading, error };
};

/**
 * useLeadDetail - Custom hook for fetching single lead details with conversation
 */
export const useLeadDetail = (leadId: string | null) => {
  const [lead, setLead] = useState<Lead | null>(null);
  const [conversation, setConversation] = useState<{ id?: string; sender?: string; text?: string; timestamp?: string }[]>([]);
  const [loading, setLoading] = useState(!!leadId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!leadId) {
      setLead(null);
      setConversation([]);
      return;
    }

    const fetchLeadDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const [leadRes, convRes] = await Promise.all([
          axios.get<Lead>(`${API_BASE_URL}/leads/${leadId}`, { timeout: 10000 }),
          axios.get<{ id?: string; sender?: string; text?: string; timestamp?: string }[]>(`${API_BASE_URL}/leads/${leadId}/conversation`, {
            timeout: 10000,
          }),
        ]);
        setLead(leadRes.data);
        setConversation(convRes.data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch lead details');
        console.error('Error fetching lead detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadDetail();
  }, [leadId]);

  return { lead, conversation, loading, error };
};

/**
 * useCalendarEvents - Custom hook for fetching calendar events
 */
export const useCalendarEvents = (autoRefresh = true, refreshInterval = 10000) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<CalendarEvent[]>(`${API_BASE_URL}/calendar/events`, {
          timeout: 10000,
        });
        setEvents(response.data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch calendar events');
        console.error('Error fetching calendar events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    if (autoRefresh) {
      const interval = setInterval(fetchEvents, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  return { events, loading, error };
};
