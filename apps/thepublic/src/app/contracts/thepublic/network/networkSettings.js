const mongoose = require('mongoose');

const networkSettingSchema = new mongoose.Schema({
  settingName: { type: String, required: true },
  value: { type: String, required: true },
  description: { type: String }
});

module.exports = mongoose.model('NetworkSetting', networkSettingSchema);