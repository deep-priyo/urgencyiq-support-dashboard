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
    assigned_to: msg.assigned_to || null,
    assigned_at: msg.assigned_at || null,
    replies: (msg.replies || []).map((r) => ({
        agent_name: r.agent_name,
        reply: r.reply,
        timestamp: r.timestamp,
    })),
});

// GET /api/messages
const getMessages = async (filters = {}) => {
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
};

// POST /api/messages/{message_id}/reply
const sendReply = async (messageId, agentName, replyText) => {
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
            reply: replyText,
            timestamp: new Date().toISOString(),
        },
    };
};

// POST /api/messages/{message_id}/resolve
const resolveTicket = async (messageId) => {
    const response = await fetch(`${BASE_URL}/api/messages/${messageId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
        throw new Error(`Failed to resolve ticket: ${response.status}`);
    }
    const data = await response.json();
    return { success: data.success };
};

// POST /api/messages/{message_id}/assign
const assignTicket = async (messageId, agentName) => {
    const response = await fetch(`${BASE_URL}/api/messages/${messageId}/assign`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agent_name: agentName }),
    });
    if (!response.ok) {
        throw new Error('Failed to assign ticket');
    }
    return response.json();
};

// POST /api/messages/{message_id}/unassign
const unassignTicket = async (messageId) => {
    const response = await fetch(`${BASE_URL}/api/messages/${messageId}/unassign`, {
        method: 'POST',
    });
    if (!response.ok) {
        throw new Error('Failed to unassign ticket');
    }
    return response.json();
};

// GET /api/get/llm
const getLLM = async () => {
    const response = await fetch(`${BASE_URL}/api/get/llm`);
    if (!response.ok) {
        throw new Error(`Failed to get LLM state: ${response.status}`);
    }
    return response.json(); // { use_llm: boolean }
};

// POST /api/set/llm
const setLLM = async (use_llm) => {
    const response = await fetch(`${BASE_URL}/api/set/llm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ use_llm }),
    });
    if (!response.ok) {
        throw new Error(`Failed to set LLM state: ${response.status}`);
    }
    return response.json(); // { success: true }
};

// Export all functions as a single default object
export default {
    getMessages,
    sendReply,
    resolveTicket,
    assignTicket,
    unassignTicket,
    getLLM,
    setLLM,
};