import React, { createContext, useContext, useState } from 'react';
import { localHubService } from '../services/LocalHubService'; // Assumes you have a LocalHubService

// Define the shape of the context
interface LocalHubContextType {
  connect: (hubPath: string) => void;
  disconnect: (hubPath: string) => void;
}

// Create the context with a default undefined value
const LocalHubContext = createContext<LocalHubContextType | undefined>(undefined);

// Define the Provider component
export const LocalHubProvider: React.FC = ({ children }) => {
  const [connectedHubs, setConnectedHubs] = useState<string[]>([]);

  // Connect to a local hub
  const connect = (hubPath: string) => {
    localHubService.connect(hubPath); // Assumes connect method exists in LocalHubService
    setConnectedHubs((prev) => [...prev, hubPath]);
  };

  // Disconnect from a local hub
  const disconnect = (hubPath: string) => {
    localHubService.disconnect(hubPath); // Assumes disconnect method exists in LocalHubService
    setConnectedHubs((prev) => prev.filter((path) => path !== hubPath));
  };

  return (
    <LocalHubContext.Provider value={{ connect, disconnect }}>
      {children}
    </LocalHubContext.Provider>
  );
};

// Custom hook to use the LocalHubContext
export const useLocalHub = (): LocalHubContextType => {
  const context = useContext(LocalHubContext);
  if (context === undefined) {
    throw new Error('useLocalHub must be used within a LocalHubProvider');
  }
  return context;
};import React, { createContext, useContext, useState } from 'react';
import { localHubService } from '../services/LocalHubService'; // Assumes you have a LocalHubService

// Define the shape of the context
interface LocalHubContextType {
  connect: (hubPath: string) => void;
  disconnect: (hubPath: string) => void;
}

// Create the context with a default undefined value
const LocalHubContext = createContext<LocalHubContextType | undefined>(undefined);

// Define the Provider component
export const LocalHubProvider: React.FC = ({ children }) => {
  const [connectedHubs, setConnectedHubs] = useState<string[]>([]);

  // Connect to a local hub
  const connect = (hubPath: string) => {
    localHubService.connect(hubPath); // Assumes connect method exists in LocalHubService
    setConnectedHubs((prev) => [...prev, hubPath]);
  };

  // Disconnect from a local hub
  const disconnect = (hubPath: string) => {
    localHubService.disconnect(hubPath); // Assumes disconnect method exists in LocalHubService
    setConnectedHubs((prev) => prev.filter((path) => path !== hubPath));
  };

  return (
    <LocalHubContext.Provider value={{ connect, disconnect }}>
      {children}
    </LocalHubContext.Provider>
  );
};

// Custom hook to use the LocalHubContext
export const useLocalHub = (): LocalHubContextType => {
  const context = useContext(LocalHubContext);
  if (context === undefined) {
    throw new Error('useLocalHub must be used within a LocalHubProvider');
  }
  return context;
};