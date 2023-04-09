const express = require('express');
const router = express.Router();
const databaseConnection = require('../db/conn');
const Firmware = require('../db/models/firmware');

/* GET firmware listing. */
router.get('/', async (req, res) => {
  try {
    const data = await Firmware.find();
    res.json(data);
  }
   catch (error) { 
		res.status(500).json({message: error.message})
	}
});

router.get('/download', (req, res) => {
  
})

router.post('/upload', (req, res) => {
  
})

module.exports = router;