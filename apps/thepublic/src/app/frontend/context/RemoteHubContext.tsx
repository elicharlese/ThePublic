// src/context/RemoteHubContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { remoteHubService } from '../services/RemoteHubService';

interface RemoteHubContextType {
  connect: (hubUrl: string) => void;
  disconnect: (hubUrl: string) => void;
}

const RemoteHubContext = createContext<RemoteHubContextType | undefined>(undefined);

export const RemoteHubProvider: React.FC = ({ children }) => {
  const [connectedHubs, setConnectedHubs] = useState<string[]>([]);

  const connect = (hubUrl: string) => {
    remoteHubService.connect(hubUrl);
    setConnectedHubs((prev) => [...prev, hubUrl]);
  };

  const disconnect = (hubUrl: string) => {
    remoteHubService.disconnect(hubUrl);
    setConnectedHubs((prev) => prev.filter((url) => url !== hubUrl));
  };

  return (
    <RemoteHubContext.Provider value={{ connect, disconnect }}>
      {children}
    </RemoteHubContext.Provider>
  );
};

export const useRemoteHub = (): RemoteHubContextType => {
  const context = useContext(RemoteHubContext);
  if (context === undefined) {
    throw new Error('useRemoteHub must be used within a RemoteHubProvider');
  }
  return context;
};