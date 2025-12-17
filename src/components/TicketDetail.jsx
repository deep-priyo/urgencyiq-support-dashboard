import { useState } from 'react';
import { Menu } from 'lucide-react';

const TicketDetail = ({ ticket, onSendReply, onResolve, agentName, onShowMetadata }) => {
  const [replyText, setReplyText] = useState('');

  if (!ticket) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center text-gray-500 p-4">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-lg">Select a ticket to view details</p>
        </div>
      </div>
    );
  }

  const handleSendReply = () => {
    if (replyText.trim()) {
      onSendReply(replyText);
      setReplyText('');
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Ticket Header */}
      <div className="p-4 lg:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl lg:text-2xl font-semibold text-[#333333]">Customer #{ticket.customer_id}</h2>
          <button onClick={onShowMetadata} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getUrgencyColor(ticket.urgency)}`}>
            {ticket.urgency.toUpperCase()}
          </span>
          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
            ticket.status === 'open' ? 'bg-[#4FCDFF] text-white' : 'bg-gray-200 text-gray-700'
          }`}>
            {ticket.status.toUpperCase()}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">Created: {new Date(ticket.created_at).toLocaleString()}</p>
      </div>

      {/* Message Content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="mb-8">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-[#6c757d] flex items-center justify-center text-white font-semibold text-sm mr-3">C</div>
              <div>
                <p className="font-semibold text-sm text-[#333333]">Customer #{ticket.customer_id}</p>
                <p className="text-xs text-gray-500">{new Date(ticket.created_at).toLocaleString()}</p>
              </div>
            </div>
            <p className="text-[#333333] mt-3">{ticket.message}</p>
          </div>
        </div>

        {/* Replies */}
        {ticket.replies && ticket.replies.length > 0 && (
          <div className="space-y-4 mb-8">
            <h3 className="font-semibold text-[#333333] mb-4">Replies</h3>
            {ticket.replies.map((reply, index) => (
              <div key={index} className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#4FCDFF] flex items-center justify-center text-white font-semibold text-sm mr-3">A</div>
                  <div>
                    <p className="font-semibold text-sm text-[#333333]">{reply.agent_name}</p>
                    <p className="text-xs text-gray-500">{new Date(reply.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-[#333333] mt-3">{reply.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply Box */}
      {ticket.status === 'open' && (
        <div className="p-4 lg:p-6 border-t border-gray-200 bg-gray-50">
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#333333] mb-2">Reply as {agentName}</label>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply..."
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-[#4FCDFF]"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSendReply}
              disabled={!replyText.trim()}
              className="flex-1 sm:flex-none px-6 py-2 bg-[#4FCDFF] text-white rounded-lg font-medium hover:bg-[#3bb8e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Reply
            </button>
            <button
              onClick={onResolve}
              className="flex-1 sm:flex-none px-6 py-2 bg-[#6c757d] text-white rounded-lg font-medium hover:bg-[#5a6268] transition-colors"
            >
              Resolve Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetail;
