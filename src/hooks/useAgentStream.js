import { useEffect, useState } from 'react';

export const useAgentStream = (analysisId) => {
  const [agentStatuses, setAgentStatuses] = useState({});
  const [activity, setActivity] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!analysisId) return;

    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/agents/stream?analysisId=${analysisId}`,
      { withCredentials: true }
    );

    eventSource.onopen = () => setIsConnected(true);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'agent_status') {
          setAgentStatuses(prev => ({
            ...prev,
            [data.agent]: data.status,
          }));
        } else if (data.type === 'activity') {
          setActivity(prev => [data, ...prev].slice(0, 100));
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [analysisId]);

  return { agentStatuses, activity, isConnected };
};
