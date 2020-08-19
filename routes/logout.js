const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate')

const router = express.Router();
router.use(bodyParser.json());

router.get('/', authenticate.verifyUser, function (req, res) {
  req.session.destroy(function (err) {
    res.redirect('/index');
  });
});

module.exports = router; 