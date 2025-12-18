import { useState } from 'react';
import { MessageSquare, X, Copy, Check } from 'lucide-react';

const CANNED_MESSAGES = [
    {
        id: 1,
        title: "Loan Status Check",
        body: "Thank you for contacting Branch. Your loan application is currently under review. We'll notify you within 24-48 hours once a decision has been made. You can check your application status anytime in the app under 'My Loans'."
    },
    {
        id: 2,
        title: "Account Update",
        body: "To update your account information, please follow these steps:\n1. Open the Branch app\n2. Go to Settings > Profile\n3. Update your details\n4. Save changes\n\nIf you need further assistance, please let us know!"
    },
    {
        id: 3,
        title: "Payment Extension Request",
        body: "We understand your current situation and want to help. Please contact our collections team at +254-XXX-XXXXXX or email collections@branch.co.ke to discuss payment arrangement options. They'll work with you to find a solution."
    },
    {
        id: 4,
        title: "Disbursement Timeline",
        body: "Congratulations on your loan approval! Once approved, loan disbursement typically takes 1-2 business days. You'll receive an SMS confirmation when the funds are sent to your M-Pesa. Please ensure your M-Pesa account is active and not locked."
    },
    {
        id: 5,
        title: "CRB Clearance",
        body: "To request a CRB clearance certificate:\n1. Ensure all outstanding loans are fully paid\n2. Contact support@branch.co.ke with your request\n3. Include your full name and ID number\n4. Allow 5-7 business days for processing\n\nClearance certificates are provided free of charge."
    },
    {
        id: 6,
        title: "Loan Rejection - Insufficient Credit",
        body: "Thank you for your loan application. Unfortunately, we're unable to approve your request at this time due to credit assessment results. We encourage you to:\n1. Make timely payments on existing loans\n2. Reapply after 7-14 days\n3. Ensure your credit information is accurate\n\nWe appreciate your understanding."
    },
    {
        id: 7,
        title: "Account Blocked - Security",
        body: "Your account has been temporarily blocked for security reasons. This is a precautionary measure to protect your account. To unblock your account:\n1. Verify your identity by emailing support@branch.co.ke\n2. Include a clear photo of your ID\n3. Provide your registered phone number\n\nOur team will review and respond within 24 hours."
    },
    {
        id: 8,
        title: "Late Payment Reminder",
        body: "This is a friendly reminder that your loan payment is overdue. To avoid additional penalties and maintain your good credit standing:\n1. Make payment as soon as possible\n2. Use M-Pesa paybill: XXXXX\n3. Account number: Your loan ID\n\nIf you're facing difficulties, please contact our collections team to discuss options."
    }
];

const CannedMessages = ({ onSelectMessage, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedId, setCopiedId] = useState(null);

    const filteredMessages = CANNED_MESSAGES.filter(msg =>
        msg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.body.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCopy = (message, e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(message.body);
        setCopiedId(message.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#4FCDFF] to-[#2a9fd4] rounded-lg flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-[#333333]">Canned Messages</h2>
                                <p className="text-sm text-gray-500">Quick responses for common inquiries</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search templates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#4FCDFF] focus:ring-2 focus:ring-[#4FCDFF]/20"
                    />
                </div>

                {/* Message List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {filteredMessages.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p>No templates found</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredMessages.map((message) => (
                                <div
                                    key={message.id}
                                    className="group border border-gray-200 rounded-xl p-4 hover:border-[#4FCDFF] hover:bg-blue-50/50 transition-all cursor-pointer"
                                    onClick={() => onSelectMessage(message.body)}
                                >
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <h3 className="font-semibold text-[#333333] group-hover:text-[#4FCDFF] transition-colors">
                                            {message.title}
                                        </h3>
                                        <button
                                            onClick={(e) => handleCopy(message, e)}
                                            className="p-1.5 hover:bg-white rounded-lg transition-colors flex-shrink-0"
                                            title="Copy to clipboard"
                                        >
                                            {copiedId === message.id ? (
                                                <Check className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <Copy className="w-4 h-4 text-gray-400 group-hover:text-[#4FCDFF]" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2 whitespace-pre-line">
                                        {message.body}
                                    </p>
                                    <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-[#4FCDFF] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        Click to use this template →
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                    <p className="text-xs text-gray-500 text-center">
                        {filteredMessages.length} template{filteredMessages.length !== 1 ? 's' : ''} available
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CannedMessages;