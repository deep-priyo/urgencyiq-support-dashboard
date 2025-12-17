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
            className="min-h-screen flex items-center justify-center p-4 relative bg-no-repeat"
            style={{
                backgroundImage:
                    'url(https://d2c5ectx2y1vm9.cloudfront.net/assets/index_local/index_local_hero.en_IN-5f305f0dd4cd806ca235e8acc50ab73435cc235996513300052facf485b1437f.png)',
                backgroundSize: '135%',     // 👈 zoom level (120%, 140%, etc.)
                backgroundPosition: '20% 15%'

            }}
        >

        <div className="absolute top-4 left-4">
                <img
                    src="https://d2c5ectx2y1vm9.cloudfront.net/assets/logo-485b81d3b9c7d0948100d5af0c6add2a27271ae40c65cdb6e98be5907ceaee32.png"
                    alt="Branch"
                    style={{ height: '2.8rem', filter: 'brightness(0)' }}
                    className="transition-all"
                />
            </div>

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