const express = require('express');
const router = express.Router();
const networkManager = require('../path/to/networkManager');
const validateNetworkSetting = require('../middleware/validationMiddleware');

// Get all network settings
router.get('/', async (req, res) => {
  try {
    const settings = await networkManager.getAllNetworkSettings();
    res.success(settings, 'Fetched all network settings successfully');
  } catch (err) {
    res.error('Failed to fetch network settings', 500);
  }
});

// Get network setting by ID
router.get('/:id', async (req, res) => {
  try {
    const setting = await networkManager.getNetworkSettingById(req.params.id);
    res.success(setting, 'Fetched network setting successfully');
  } catch (err) {
    res.error('Failed to fetch network setting', 500);
  }
});

// Create a new network setting
router.post('/', validateNetworkSetting, async (req, res) => {
  const { settingName, value } = req.body;

  try {
    const newSetting = await networkManager.createNetworkSetting({ settingName, value });
    res.success(newSetting, 'Network setting created successfully');
  } catch (err) {
    res.error('Failed to create network setting', 500);
  }
});

// Update an existing network setting
router.put('/:id', validateNetworkSetting, async (req, res) => {
  const { prop, value } = req.body;

  try {
    const updatedSetting = await networkManager.updateNetworkSetting(req.params.id, { prop, value });
    res.success(updatedSetting, 'Network setting updated successfully');
  } catch (err) {
    res.error('Failed to update network setting', 500);
  }
});

// Delete a network setting
router.delete('/:id', async (req, res) => {
  try {
    await networkManager.deleteNetworkSetting(req.params.id);
    res.success(null, 'Network setting deleted successfully');
  } catch (err) {
    res.error('Failed to delete network setting', 500);
  }
});

module.exports = router;