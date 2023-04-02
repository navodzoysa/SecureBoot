var express = require('express');
var moment = require('moment');
var router = express.Router();

/* GET devices listing. */
router.get('/', function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
	const data = [{
		deviceName: 'NodeMCU-32S',
		deviceStatus: 'Active',
		lastSynced: moment().subtract(5, 'minute').calendar()
	}];
  res.send(data);
});

module.exports = router;