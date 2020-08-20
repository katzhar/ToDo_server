const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const authenticate = require('../authenticate');

const router = express.Router();
router.use(bodyParser.json());

router.post('/', passport.authenticate('local'), (req, res) => {
    let token = authenticate.getToken({ _id: req.user._id })
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
        success: true,
        token: token
    });
})

module.exports = router;