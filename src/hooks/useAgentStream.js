import { useEffect, useState } from 'react';

export const useAgentStream = (analysisId) => {
  const [agentStatuses, setAgentStatuses] = useState({});
  const [activity, setActivity] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // Agent streaming will be implemented via Supabase Realtime in the future
  // For now, return empty state

  return { agentStatuses, activity, isConnected };
};
