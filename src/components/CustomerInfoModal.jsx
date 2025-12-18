import { useState, useEffect } from 'react';
import { X, User, MessageSquare, Clock, TrendingUp, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

const CustomerInfoModal = ({ customerId, onClose }) => {
    const [customerInfo, setCustomerInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCustomerInfo();
    }, [customerId]);

    const fetchCustomerInfo = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`http://localhost:5000/api/customers/${customerId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch customer info');
            }

            const data = await response.json();
            setCustomerInfo(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getUrgencyColor = (urgency) => {
        if (urgency >= 4.5) return 'text-red-600 bg-red-50';
        if (urgency >= 3.5) return 'text-orange-600 bg-orange-50';
        if (urgency >= 2.5) return 'text-yellow-600 bg-yellow-50';
        return 'text-green-600 bg-green-50';
    };

    const getUrgencyLabel = (urgency) => {
        if (urgency >= 4.5) return 'Critical';
        if (urgency >= 3.5) return 'High';
        if (urgency >= 2.5) return 'Medium';
        return 'Low';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#4FCDFF] to-[#3bb8e6] rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <User className="w-6 h-6 text-[#4FCDFF]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">Customer Profile</h2>
                                <p className="text-sm text-white/90">ID: #{customerId}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4FCDFF] mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading customer information...</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                <p className="text-red-600 mb-4">{error}</p>
                                <button
                                    onClick={fetchCustomerInfo}
                                    className="px-4 py-2 bg-[#4FCDFF] text-white rounded-lg hover:bg-[#3bb8e6] transition-colors"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    )}

                    {customerInfo && !loading && !error && (
                        <div className="space-y-4">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Total Messages */}
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                            <MessageSquare className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-blue-700 font-medium">Total Messages</p>
                                            <p className="text-2xl font-bold text-blue-900">{customerInfo.total_messages}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Open Messages */}
                                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                                            <AlertCircle className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-orange-700 font-medium">Open Tickets</p>
                                            <p className="text-2xl font-bold text-orange-900">{customerInfo.open_messages}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Resolved Messages */}
                                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                            <CheckCircle className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-green-700 font-medium">Resolved</p>
                                            <p className="text-2xl font-bold text-green-900">{customerInfo.resolved_messages}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Average Urgency */}
                                <div className={`bg-gradient-to-br rounded-xl p-4 border shadow-sm ${
                                    getUrgencyColor(customerInfo.avg_urgency)
                                }`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                            customerInfo.avg_urgency >= 4.5 ? 'bg-red-500' :
                                                customerInfo.avg_urgency >= 3.5 ? 'bg-orange-500' :
                                                    customerInfo.avg_urgency >= 2.5 ? 'bg-yellow-500' : 'bg-green-500'
                                        }`}>
                                            <TrendingUp className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Avg Urgency</p>
                                            <p className="text-2xl font-bold">
                                                {customerInfo.avg_urgency.toFixed(1)}
                                                <span className="text-sm font-normal ml-2">
                          ({getUrgencyLabel(customerInfo.avg_urgency)})
                        </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 shadow-sm">
                                <h3 className="font-semibold text-[#333333] mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-[#4FCDFF]" />
                                    Interaction Timeline
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-gray-600">First Contact</span>
                                        </div>
                                        <span className="text-sm font-medium text-[#333333]">
                      {customerInfo.first_contact
                          ? new Date(customerInfo.first_contact).toLocaleString()
                          : 'N/A'}
                    </span>
                                    </div>
                                    <div className="border-t border-gray-200"></div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-gray-600">Last Contact</span>
                                        </div>
                                        <span className="text-sm font-medium text-[#333333]">
                      {customerInfo.last_contact
                          ? new Date(customerInfo.last_contact).toLocaleString()
                          : 'N/A'}
                    </span>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Insights */}
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200 shadow-sm">
                                <h3 className="font-semibold text-purple-900 mb-3">📊 Customer Insights</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-purple-700">Resolution Rate</span>
                                        <span className="font-semibold text-purple-900">
                      {customerInfo.total_messages > 0
                          ? `${Math.round((customerInfo.resolved_messages / customerInfo.total_messages) * 100)}%`
                          : 'N/A'}
                    </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-purple-700">Active Issues</span>
                                        <span className="font-semibold text-purple-900">{customerInfo.open_messages}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-purple-700">Priority Level</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            getUrgencyColor(customerInfo.avg_urgency)
                                        }`}>
                      {getUrgencyLabel(customerInfo.avg_urgency)}
                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-2 bg-[#4FCDFF] text-white rounded-lg font-medium hover:bg-[#3bb8e6] hover:shadow-lg transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerInfoModal;