import { X } from 'lucide-react';

const MetadataPanel = ({ ticket, isOpen, onClose }) => {
    if (!ticket) return null;

    const getUrgencyBadge = (urgency) => {
        switch (urgency) {
            case 'critical': return 'bg-red-100 text-red-700 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />
            )}

            {/* Metadata Panel */}
            <div
                className={`
          fixed lg:relative inset-y-0 right-0 z-50
          w-64 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
            >
                {/* Mobile Close Button */}
                <div className="lg:hidden flex justify-end mb-4">
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <h3 className="font-semibold text-[#333333] mb-4 bg-gradient-to-r from-[#4FCDFF] to-[#2a9fd4] bg-clip-text text-transparent">Ticket Information</h3>

                <div className="space-y-4">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Customer ID</p>
                        <p className="font-medium text-[#333333]">#{ticket.customer_id}</p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Status</p>
                        <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
                                ticket.status === 'open'
                                    ? 'bg-gradient-to-r from-[#4FCDFF] to-[#3bb8e6] text-white'
                                    : 'bg-gray-200 text-gray-700'
                            }`}
                        >
              {ticket.status}
            </span>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Urgency</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border shadow-sm ${getUrgencyBadge(ticket.urgency)}`}>
              {ticket.urgency}
            </span>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Created</p>
                        <p className="text-sm text-[#333333]">
                            {new Date(ticket.created_at).toLocaleDateString()} <br />
                            {new Date(ticket.created_at).toLocaleTimeString()}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Replies</p>
                        <p className="font-medium text-[#333333]">{ticket.replies?.length || 0}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MetadataPanel;