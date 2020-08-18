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
        .isLength({ min: 5 }),
    check('email')
        .isEmail()
        .withMessage('invalid email address'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('password is required')
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


// require('dotenv/config');
// const express = require('express');
// const bodyParser = require('body-parser');
// const Users = require('../models/users');

// const router = express.Router();
// router.use(bodyParser.json());

// router.post('/', (req, res) => {

//     const emailChecker = email => {
//         const regex = /\S+@\S+\.\S+/;
//         return regex.test(email);
//     };

//     const pwdChecker = password => {
//         const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
//         return regex.test(password);
//     };

//     async function validation(data) {
//         if (await Users.exists({ email: data.email }))
//             return res.send({ msg: 'this email is already in use' });
//         if (!emailChecker(data.email))
//             return res.send({ msg: 'incorrect format of email' });
//         if (await Users.exists({ login: data.login }))
//             return res.send({ msg: 'this login is already in use' });
//         if (!pwdChecker(data.password))
//             return res.send({ msg: 'Your password must be at least 6 characters long, be of mixed case and also contain a digit or symbol.' })
//         else {
//             let user = new Users({
//                 fn: data.fn,
//                 ln: data.ln,
//                 login: data.login,
//                 email: data.email,
//                 password: data.password,
//                 confirmlink: token
//             })
//             user.save();
//         }
//     }
//     validation(req.body);
// });

module.exports = router;