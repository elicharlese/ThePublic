const userHasPermission = (user, action) => {
  // Implement logic to check user permissions
  return user.roles.includes('admin') || user.permissions.includes(action);
};

const handleNmapClick = async () => {
  if (!userHasPermission(currentUser, 'nmap_scan')) {
    setLog([...log, 'Error: Insufficient permissions for this action']);
    return;
  }

  setScanning(true);
  // Proceed with scanning logic...
};

const handleWiresharkClick = async () => {
  if (!userHasPermission(currentUser, 'wireshark_capture')) {
    setLog([...log, 'Error: Insufficient permissions for this action']);
    return;
  }

  // Proceed with capture logic...
};