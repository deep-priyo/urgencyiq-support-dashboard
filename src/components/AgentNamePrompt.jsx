import { useState } from 'react';
import { User } from 'lucide-react';

const AgentNamePrompt = ({ onSubmit }) => {
    const [name, setName] = useState('');

    const handleSubmit = () => {
        if (name.trim()) {
            onSubmit(name.trim());
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div
            className="min-h-[100svh] flex items-center justify-center p-4 relative bg-no-repeat bg-cover bg-center"
            style={{
                backgroundImage:
                    'url(https://images.unsplash.com/vector-1762815716701-10861053923a?q=80&w=1431&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)'
            }}
        >



            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-[#4FCDFF] rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold text-[#333333] mb-2">Welcome to Support Dashboard</h2>
                    <p className="text-gray-600">Please enter your name to continue</p>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-[#333333] mb-2">Agent Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4FCDFF]"
                        autoFocus
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!name.trim()}
                    className="w-full px-6 py-3 bg-[#4FCDFF] text-white rounded-lg font-medium hover:bg-[#3bb8e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default AgentNamePrompt;