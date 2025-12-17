import { Search, X } from 'lucide-react';

const TicketList = ({ tickets, selectedTicket, onSelectTicket, searchTerm, onSearchChange, isOpen, onClose }) => {
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const truncateMessage = (msg) => (msg.length > 60 ? msg.substring(0, 60) + '...' : msg);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          w-80 bg-white border-r border-gray-200 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end p-4 border-b border-gray-200">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#4FCDFF]"
            />
          </div>
        </div>

        {/* Ticket List */}
        <div className="flex-1 overflow-y-auto">
          {tickets.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">No tickets found</div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => {
                  onSelectTicket(ticket);
                  onClose();
                }}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedTicket?.id === ticket.id ? 'bg-blue-50 border-l-4 border-l-[#4FCDFF]' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-[#333333]">Customer #{ticket.customer_id}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(ticket.urgency)}`}>
                    {ticket.urgency}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{truncateMessage(ticket.message)}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{new Date(ticket.created_at).toLocaleString()}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      ticket.status === 'open' ? 'bg-[#4FCDFF] text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default TicketList;
