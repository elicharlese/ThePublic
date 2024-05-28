const networkManager = require('../services/networkManager');

const getAllNetworkSettings = async (req, res) => {
  try {
    const settings = await networkManager.getAllNetworkSettings();
    res.send(settings);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getNetworkSettingById = async (req, res) => {
  try {
    const setting = await networkManager.getNetworkSettingById(req.params.id);
    res.send(setting);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const createNetworkSetting = async (req, res) => {
  const { settingName, value } = req.body;
  try {
    const response = await networkManager.createNetworkSetting(settingName, value);
    res.status(201).send(response);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

const updateNetworkSetting = async (req, res) => {
  const { id } = req.params;
  const { prop, value } = req.body;
  try {
    const response = await networkManager.updateNetworkSetting(id, prop, value);
    res.send(response);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

const deleteNetworkSetting = async (req, res) => {
  try {
    const response = await networkManager.deleteNetworkSetting(req.params.id);
    res.send(response);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  getAllNetworkSettings,
  getNetworkSettingById,
  createNetworkSetting,
  updateNetworkSetting,
  deleteNetworkSetting,
};