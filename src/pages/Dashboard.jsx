import { useEffect, useState } from 'react';
import { Menu, Wifi, WifiOff, Bell } from 'lucide-react';
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
    const [sortBy, setSortBy] = useState('urgency');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [metadataOpen, setMetadataOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Real-time polling state
    const [isPolling, setIsPolling] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [newMessagesCount, setNewMessagesCount] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Initial load
    useEffect(() => {
        loadTickets();
    }, [statusFilter, sortBy]);

    // Real-time polling - Check for updates every 10 seconds
    useEffect(() => {
        if (!isPolling) return;

        const POLL_INTERVAL = 10000; // 10 seconds

        console.log('🔄 Polling started - checking every 10 seconds');

        const pollInterval = setInterval(async () => {
            console.log('🔍 Polling for new messages...');
            setIsRefreshing(true); // Show refresh indicator
            try {
                const filters = {
                    status: statusFilter,
                    sort: sortBy,
                };

                const data = await api.getMessages(filters);
                console.log(`✅ Poll complete - ${data.length} tickets fetched`);

                // Check if there are new messages
                const newMessages = data.filter(msg => {
                    const msgTime = new Date(msg.timestamp);
                    return msgTime > lastUpdate;
                });

                if (newMessages.length > 0) {
                    console.log(`🆕 ${newMessages.length} new message(s) found!`);
                    setNewMessagesCount(prev => prev + newMessages.length);

                    // Show notification
                    if ('Notification' in window && Notification.permission === 'granted') {
                        new Notification('New Support Messages', {
                            body: `${newMessages.length} new message(s) received`,
                            icon: '/logo.png',
                            tag: 'new-messages'
                        });
                    }
                }

                setTickets(data);
                setLastUpdate(new Date());
            } catch (err) {
                console.error('❌ Polling error:', err);
            } finally {
                setIsRefreshing(false); // Hide refresh indicator
            }
        }, POLL_INTERVAL);

        return () => {
            console.log('🛑 Polling stopped');
            clearInterval(pollInterval);
        };
    }, [isPolling, statusFilter, sortBy]); // Removed lastUpdate from dependencies

    // Request notification permission on mount
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

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
            setLastUpdate(new Date());
            setNewMessagesCount(0); // Reset counter on manual load
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

    const handleAssign = async (messageId, agentName) => {
        try {
            const result = await api.assignTicket(messageId, agentName);
            if (result.success) {
                // Update local state
                const updatedTickets = tickets.map((t) => {
                    if (t.id === messageId) {
                        return {
                            ...t,
                            assigned_to: result.assigned_to,
                            assigned_at: result.assigned_at
                        };
                    }
                    return t;
                });
                setTickets(updatedTickets);

                if (selectedTicket?.id === messageId) {
                    setSelectedTicket({
                        ...selectedTicket,
                        assigned_to: result.assigned_to,
                        assigned_at: result.assigned_at
                    });
                }
            }
        } catch (err) {
            alert('Failed to assign ticket. Please try again.');
            console.error('Error assigning ticket:', err);
        }
    };

    const handleUnassign = async (messageId) => {
        try {
            const result = await api.unassignTicket(messageId);
            if (result.success) {
                // Update local state
                const updatedTickets = tickets.map((t) => {
                    if (t.id === messageId) {
                        return { ...t, assigned_to: null, assigned_at: null };
                    }
                    return t;
                });
                setTickets(updatedTickets);

                if (selectedTicket?.id === messageId) {
                    setSelectedTicket({
                        ...selectedTicket,
                        assigned_to: null,
                        assigned_at: null
                    });
                }
            }
        } catch (err) {
            alert('Failed to unassign ticket. Please try again.');
            console.error('Error unassigning ticket:', err);
        }
    };

    const togglePolling = () => {
        setIsPolling(!isPolling);
    };

    const clearNewMessages = () => {
        setNewMessagesCount(0);
    };

    if (loading) {
        return (
            <div
                className="flex items-center justify-center h-screen bg-gradient-to-br from-[#4FCDFF] via-[#3bb8e6] to-[#2a9fd4]">
                <div className="text-center bg-white rounded-2xl shadow-2xl p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4FCDFF] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading tickets...</p>
                    <p className="text-gray-500 text-sm mt-2">Note: This may take a few seconds as the server is on Render's free tier...</p>
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

                        {/* Real-time Status Indicator */}
                        <div className="hidden sm:flex items-center gap-2">
                            <button
                                onClick={togglePolling}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    isPolling
                                        ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                                        : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                                }`}
                                title={isPolling ? 'Real-time updates ON' : 'Real-time updates OFF'}
                            >
                                {isPolling ? (
                                    <>
                                        <Wifi className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-pulse' : ''}`} />
                                        <span>Live</span>
                                        {isRefreshing && <span className="ml-1">•</span>}
                                    </>
                                ) : (
                                    <>
                                        <WifiOff className="w-3.5 h-3.5" />
                                        <span>Paused</span>
                                    </>
                                )}
                            </button>

                            {/* New Messages Badge */}
                            {newMessagesCount > 0 && (
                                <button
                                    onClick={() => {
                                        clearNewMessages();
                                        loadTickets();
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-lg text-xs font-medium hover:bg-orange-100 transition-all animate-pulse"
                                >
                                    <Bell className="w-3.5 h-3.5" />
                                    <span>{newMessagesCount} new</span>
                                </button>
                            )}
                        </div>
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

                {/* Mobile Filters & Status */}
                <div className="flex gap-2 mt-3">
                    <div className="md:hidden flex gap-2 flex-1">
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

                    {/* Mobile Real-time Status */}
                    <button
                        onClick={togglePolling}
                        className={`sm:hidden px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isPolling
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-gray-100 text-gray-600 border border-gray-300'
                        }`}
                    >
                        {isPolling ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                    </button>
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
                    onClose={() => setSelectedTicket(null)}
                    onAssign={handleAssign}
                    onUnassign={handleUnassign}
                />

                <MetadataPanel ticket={selectedTicket} isOpen={metadataOpen} onClose={() => setMetadataOpen(false)} />
            </div>
        </div>
    );
};

export default Dashboard;