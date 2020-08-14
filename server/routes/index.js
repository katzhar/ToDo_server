const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate')

const router = express.Router();
router.use(bodyParser.json());

router.get('/', (req, res) => {
    res.send('/index');
})

module.exports = router;  