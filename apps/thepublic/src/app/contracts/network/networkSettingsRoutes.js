const express = require('express');
const { check, validationResult } = require('express-validator');
const networkSettingsController = require('../controllers/networkSettingsController');

const router = express.Router();

// GET all network settings
router.get('/', networkSettingsController.getAllNetworkSettings);

// GET single network setting by id
router.get('/:id', networkSettingsController.getNetworkSettingById);

// POST new network setting
router.post(
  '/',
  [
    check('settingName').isString().notEmpty(),
    check('value').isString().notEmpty(),
    check('description').optional().isString()
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  networkSettingsController.createNetworkSetting
);

// PUT update network setting by id
router.put(
  '/:id',
  [
    check('settingName').isString().notEmpty(),
    check('value').isString().notEmpty(),
    check('description').optional().isString()
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  networkSettingsController.updateNetworkSetting
);

// DELETE network setting by id
router.delete('/:id', networkSettingsController.deleteNetworkSetting);

module.exports = router;