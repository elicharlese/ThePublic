import { PersistentMap } from "near-sdk-as";

@nearBindgen
class WiFiNetwork {
  ssid: string;
  password: string;

  constructor(ssid: string, password: string) {
    this.ssid = ssid;
    this.password = password;
  }
}

const availableNetworks = new PersistentMap<string, WiFiNetwork>("networks");

export function addNetwork(ssid: string, password: string): void {
  const network = new WiFiNetwork(ssid, password);
  availableNetworks.set(ssid, network);
}

export function getAvailableNetworks(): Array<WiFiNetwork> {
  return availableNetworks.values();
}

export function connectToNetwork(ssid: string, password: string): string {
  const network = availableNetworks.getSome(ssid);
  if (network.password == password) {
    return "Connected successfully";
  } else {
    return "Connection failed";
  }
}