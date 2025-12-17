import { useState, useEffect } from 'react';
import AgentNamePrompt from './components/AgentNamePrompt';
import Dashboard from './pages/Dashboard';

// Main App Component
export default function App() {
  const [agentName, setAgentName] = useState(null);

  useEffect(() => {
    const storedName = sessionStorage.getItem('agentName');
    if (storedName) {
      setAgentName(storedName);
    }
  }, []);

  const handleAgentNameSubmit = (name) => {
    sessionStorage.setItem('agentName', name);
    setAgentName(name);
  };

  const handleLogout = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } finally {
      setAgentName(null);
    }
  };

  if (!agentName) {
    return <AgentNamePrompt onSubmit={handleAgentNameSubmit} />;
  }

  return <Dashboard agentName={agentName} onLogout={handleLogout} />;
}