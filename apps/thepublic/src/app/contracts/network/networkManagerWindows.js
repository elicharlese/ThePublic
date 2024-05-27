const { exec } = require('child_process');

const executeCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      resolve(stdout || stderr);
    });
  });
};

const getAllNetworkSettings = async () => {
  return await executeCommand('netsh interface show interface');
};

const getNetworkSettingById = async (id) => {
  return await executeCommand(`netsh interface ipv4 show address ${id}`);
};

const createNetworkSetting = async (settingName, value) => {
  // Implement according to the specific command required for adding network settings
};

const updateNetworkSetting = async (id, prop, value) => {
  return await executeCommand(`netsh interface ipv4 set address ${id} ${prop} ${value}`);
};

const deleteNetworkSetting = async (id) => {
  return await executeCommand(`netsh interface delete interface ${id}`);
};

module.exports = {
  getAllNetworkSettings,
  getNetworkSettingById,
  createNetworkSetting,
  updateNetworkSetting,
  deleteNetworkSetting,
};