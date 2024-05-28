// tests/AdvancedSettings.test.js

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AdvancedSettings from '../path-to-your-advanced-settings-component/AdvancedSettings';
import { remoteHubService } from '../path-to-services/RemoteHubService';

// Mock the remoteHubService
jest.mock('../path-to-services/RemoteHubService');

describe('AdvancedSettings Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('updates network settings successfully', async () => {
    window.prompt = jest.fn().mockReturnValue('testAccount');
    remoteHubService.updateNetworkSettings = jest.fn().mockResolvedValue();

    render(<AdvancedSettings />);

    fireEvent.change(screen.getByLabelText(/Network Timeout/i), { target: { value: '300' } });
    fireEvent.change(screen.getByLabelText(/Max Transaction Fee/i), { target: { value: '1000' } });
    fireEvent.click(screen.getByText(/Update Network Settings/i));

    expect(remoteHubService.updateNetworkSettings).toHaveBeenCalledWith(300, 1000, 'testAccount');
    expect(window.alert).toHaveBeenCalledWith('Network settings updated');
  });

  test('sets custom node successfully', async () => {
    window.prompt = jest.fn().mockReturnValue('testAccount');
    remoteHubService.setCustomNode = jest.fn().mockResolvedValue();

    render(<AdvancedSettings />);

    fireEvent.change(screen.getByLabelText(/Custom Node/i), { target: { value: 'custom.node.url' } });
    fireEvent.click(screen.getByLabelText(/Allow Node/i));
    fireEvent.click(screen.getByText(/Set Custom Node/i));

    expect(remoteHubService.setCustomNode).toHaveBeenCalledWith('custom.node.url', true, 'testAccount');
    expect(window.alert).toHaveBeenCalledWith('Custom node settings updated');
  });

  // Add more tests for boundary cases if needed
});