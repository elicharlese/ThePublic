// src/services/RemoteHubService.ts
class RemoteHubService {
  private connections: { [key: string]: WebSocket } = {};

  connect(hubUrl: string): void {
    if (this.connections[hubUrl]) {
      return;
    }

    const ws = new WebSocket(hubUrl);

    ws.onopen = () => {
      console.log(`Connected to ${hubUrl}`);
    };

    ws.onmessage = (event) => {
      console.log(`Message from ${hubUrl}:`, event.data);
    };

    ws.onclose = () => {
      console.log(`Disconnected from ${hubUrl}`);
      delete this.connections[hubUrl];
    };

    this.connections[hubUrl] = ws;
  }

  disconnect(hubUrl: string): void {
    if (this.connections[hubUrl]) {
      this.connections[hubUrl].close();
    }
  }
}

export const remoteHubService = new RemoteHubService();