const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const Users = require('../models/users');
const { check, validationResult } = require('express-validator');

const router = express.Router();
router.use(bodyParser.json());

router.post('/', [
    check('username')
        .notEmpty()
        .withMessage('username is required')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
        .withMessage('username should not be empty, minimum six characters, at least one letter and one number'),
    check('email')
        .isEmail()
        .withMessage('invalid email address'),
    check('password')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
        .withMessage('password should not be empty, minimum six characters, at least one letter and one number')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    else {
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
                        res.json({ success: true });
                    });
                }
            });
    }
});

module.exports = router;