const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const Users = require('../models/users');

const router = express.Router();
router.use(bodyParser.json());

router.post('/', (req, res) => {
    Users.register(new Users({ username: req.body.username }),
        req.body.password, (err, user) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({ err: err });
            } 
            else {
                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ success: true, status: 'Registration Successful!' }); 
                });
            }
        });
});

module.exports = router;