import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import TicketList from '../components/TicketList';
import TicketDetail from '../components/TicketDetail';
import MetadataPanel from '../components/MetadataPanel';
import api from '../services/api';

const Dashboard = ({ agentName, onLogout }) => {
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('open');
    const [sortBy, setSortBy] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [metadataOpen, setMetadataOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadTickets();
    }, [statusFilter, sortBy]);

    useEffect(() => {
        applySearchFilter();
    }, [tickets, searchTerm]);

    const loadTickets = async () => {
        try {
            setLoading(true);
            setError(null);

            const filters = {
                status: statusFilter,
                sort: sortBy,
            };

            const data = await api.getMessages(filters);
            setTickets(data);
        } catch (err) {
            setError('Failed to load tickets. Please try again.');
            console.error('Error loading tickets:', err);
        } finally {
            setLoading(false);
        }
    };

    const applySearchFilter = () => {
        let filtered = [...tickets];
        if (searchTerm) {
            filtered = filtered.filter(
                (t) =>
                    t.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    t.customer_id.toString().includes(searchTerm)
            );
        }
        setFilteredTickets(filtered);
        if (selectedTicket && !filtered.find((t) => t.id === selectedTicket.id)) {
            setSelectedTicket(null);
        }
    };

    const handleSendReply = async (message) => {
        if (!selectedTicket) return;
        try {
            const result = await api.sendReply(selectedTicket.id, agentName, message);
            if (result.success) {
                const updatedTickets = tickets.map((t) => {
                    if (t.id === selectedTicket.id) {
                        return { ...t, replies: [...(t.replies || []), result.reply] };
                    }
                    return t;
                });
                setTickets(updatedTickets);
                setSelectedTicket({
                    ...selectedTicket,
                    replies: [...(selectedTicket.replies || []), result.reply],
                });
            }
        } catch (err) {
            alert('Failed to send reply. Please try again.');
            console.error('Error sending reply:', err);
        }
    };

    const handleResolve = async () => {
        if (!selectedTicket) return;
        try {
            const result = await api.resolveTicket(selectedTicket.id);
            if (result.success) {
                const updatedTickets = tickets.filter((t) => t.id !== selectedTicket.id);
                setTickets(updatedTickets);
                setSelectedTicket(null);
            }
        } catch (err) {
            alert('Failed to resolve ticket. Please try again.');
            console.error('Error resolving ticket:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#4FCDFF] via-[#3bb8e6] to-[#2a9fd4]">
                <div className="text-center bg-white rounded-2xl shadow-2xl p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4FCDFF] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading tickets...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#4FCDFF] via-[#3bb8e6] to-[#2a9fd4]">
                <div className="text-center bg-white rounded-2xl shadow-2xl p-8">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button onClick={loadTickets} className="px-6 py-2 bg-[#4FCDFF] text-white rounded-lg font-medium hover:bg-[#3bb8e6] shadow-lg hover:shadow-xl transition-all">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-[#4FCDFF] via-[#3bb8e6] to-[#2a9fd4]">
            {/* Header */}
            <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 lg:px-6 py-4 shadow-md">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Menu className="w-5 h-5 text-gray-600" />
                        </button>
                        <h1 className="text-lg lg:text-xl font-semibold bg-gradient-to-r from-[#4FCDFF] to-[#2a9fd4] bg-clip-text text-transparent">Support Dashboard</h1>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-4">
                        {/* Filters */}
                        <div className="hidden md:flex items-center gap-2">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#4FCDFF] focus:ring-2 focus:ring-[#4FCDFF]/20 transition-all"
                            >
                                <option value="all">All Tickets</option>
                                <option value="open">Open</option>
                                <option value="resolved">Resolved</option>
                            </select>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#4FCDFF] focus:ring-2 focus:ring-[#4FCDFF]/20 transition-all"
                            >
                                <option value="urgency">Sort by Urgency</option>
                                <option value="time">Sort by Time</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4FCDFF] to-[#2a9fd4] flex items-center justify-center text-white font-semibold shadow-lg">
                                {agentName.charAt(0).toUpperCase()}
                            </div>
                            <span className="hidden sm:inline text-sm text-[#333333]">
                <span className="hidden lg:inline">Agent: </span>
                <span className="font-semibold">{agentName}</span>
              </span>
                            <button
                                onClick={onLogout}
                                className="ml-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-[#333333] hover:bg-gray-100 transition-colors"
                                title="Logout"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Filters */}
                <div className="md:hidden flex gap-2 mt-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#4FCDFF] transition-all"
                    >
                        <option value="all">All</option>
                        <option value="open">Open</option>
                        <option value="resolved">Resolved</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#4FCDFF] transition-all"
                    >
                        <option value="time">By Time</option>
                        <option value="urgency">By Urgency</option>
                    </select>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden relative p-2 lg:p-4 gap-2 lg:gap-4">
                <TicketList
                    tickets={filteredTickets}
                    selectedTicket={selectedTicket}
                    onSelectTicket={setSelectedTicket}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                <TicketDetail
                    ticket={selectedTicket}
                    onSendReply={handleSendReply}
                    onResolve={handleResolve}
                    agentName={agentName}
                    onShowMetadata={() => setMetadataOpen(true)}
                />

                <MetadataPanel ticket={selectedTicket} isOpen={metadataOpen} onClose={() => setMetadataOpen(false)} />
            </div>
        </div>
    );
};

export default Dashboard;