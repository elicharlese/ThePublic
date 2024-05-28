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
  return await executeCommand('nmcli device show');
};

const getNetworkSettingById = async (id) => {
  return await executeCommand(`nmcli device show ${id}`);
};

const createNetworkSetting = async (settingName, value) => {
  return await executeCommand(`nmcli con add type ${settingName} ${value}`);
};

const updateNetworkSetting = async (id, prop, value) => {
  return await executeCommand(`nmcli con mod ${id} ${prop} ${value}`);
};

const deleteNetworkSetting = async (id) => {
  return await executeCommand(`nmcli con delete ${id}`);
};

module.exports = {
  getAllNetworkSettings,
  getNetworkSettingById,
  createNetworkSetting,
  updateNetworkSetting,
  deleteNetworkSetting,
};