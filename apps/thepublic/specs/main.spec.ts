import { addNetwork, getAvailableNetworks, connectToNetwork } from "./main";

describe("WiFi Network Smart Contract", () => {
  it("should add and retrieve available networks", () => {
    addNetwork("TestWifi1", "password123");
    addNetwork("TestWifi2", "password456");

    const networks = getAvailableNetworks();
    expect(networks.length).toBe(2, "There should be 2 networks available");
    expect(networks[0].ssid).toBe("TestWifi1");
    expect(networks[1].ssid).toBe("TestWifi2");
  });

  it("should connect to a network with the correct password", () => {
    addNetwork("TestWifi1", "password123");

    const response = connectToNetwork("TestWifi1", "password123");
    expect(response).toBe("Connected successfully");
  });

  it("should fail to connect to a network with an incorrect password", () => {
    addNetwork("TestWifi1", "password123");

    const response = connectToNetwork("TestWifi1", "wrongpassword");
    expect(response).toBe("Connection failed");
  });

  it("should return an error when trying to connect to a non-existing network", () => {
    const response = connectToNetwork("NonExistingWifi", "password");
    expect(response).toBe("Connection failed");
  });
});