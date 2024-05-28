const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');

// Route for collecting data
router.post('/collect', async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).send('No data provided');
    }

    const analyticsData = new Analytics({ data, timestamp: new Date() });
    await analyticsData.save();
    res.status(201).send('Data collected successfully');
  } catch (error) {
    res.status(500).send('Error collecting data');
  }
});

// Route for getting analytics
router.get('/results', async (req, res) => {
  try {
    const analyticsResults = await Analytics.aggregate([
      {
        $group: {
          _id: null,
          averageData: { $avg: "$data" },
          count: { $sum: 1 }
        }
      }
    ]);
    res.json(analyticsResults);
  } catch (error) {
    res.status(500).send('Error fetching analytics');
  }
});

module.exports = router;