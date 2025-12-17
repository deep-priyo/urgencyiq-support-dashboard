// Centralized API service
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Convert backend urgency number to label
const getUrgencyLabel = (urgency) => {
  if (urgency >= 5) return 'critical';
  if (urgency >= 4) return 'high';
  if (urgency >= 3) return 'medium';
  return 'low';
};

// Transform backend message to frontend format
const transformMessage = (msg) => ({
  id: msg.id,
  customer_id: msg.customer_id,
  message: msg.message,
  status: msg.status,
  urgency: getUrgencyLabel(msg.urgency),
  created_at: msg.timestamp,
  replies: (msg.replies || []).map((r) => ({
    agent_name: r.agent_name,
    message: r.reply,
    timestamp: r.timestamp,
  })),
});

const api = {
  // GET /api/messages
  getMessages: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);

    const url = `${BASE_URL}/api/messages${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.status}`);
    }
    const data = await response.json();
    return data.map(transformMessage);
  },

  // POST /api/messages/{message_id}/reply
  sendReply: async (messageId, agentName, replyText) => {
    const response = await fetch(`${BASE_URL}/api/messages/${messageId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent_name: agentName, reply: replyText }),
    });
    if (!response.ok) {
      throw new Error(`Failed to send reply: ${response.status}`);
    }
    const data = await response.json();
    return {
      success: data.success,
      reply: {
        agent_name: agentName,
        message: replyText,
        timestamp: new Date().toISOString(),
      },
    };
  },

  // POST /api/messages/{message_id}/resolve
  resolveTicket: async (messageId) => {
    const response = await fetch(`${BASE_URL}/api/messages/${messageId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Failed to resolve ticket: ${response.status}`);
    }
    const data = await response.json();
    return { success: data.success };
  },
};

export default api;
