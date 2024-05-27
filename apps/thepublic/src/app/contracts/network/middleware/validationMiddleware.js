const { body, validationResult } = require('express-validator');

const validateNetworkSetting = [
  body('settingName').notEmpty().withMessage('Setting name is required'),
  body('value').notEmpty().withMessage('Value is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateNetworkSetting;