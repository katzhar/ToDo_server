require('dotenv/config');
let passport = require('passport');
let jwt = require('jsonwebtoken');
let memjs = require('memjs');
let Users = require('./models/users');
let LocalStrategy = require('passport-local').Strategy;
let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;

passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

let client = memjs.Client.create(process.env.MEMCACHEDCLOUD_SERVERS, {
    username: process.env.MEMCACHEDCLOUD_USERNAME,
    password: process.env.MEMCACHEDCLOUD_PASSWORD
});

exports.getToken = (user) => {
    return jwt.sign(user, process.env.SECRET_KEY,
        { expiresIn: 3600 })
}

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        Users.findOne({ _id: jwt_payload._id }, (err, user) => {
            if (err)
                return done(err, false);
            else if (user)
                return done(null, user);
            else
                return done(null, false);
        })
    }))

exports.isBlacklisted = (data) => {
    return new Promise((resolve, reject) => {
        client.get(data, (err, token) => {
            if (err) reject(err);
            else if (token === null)
                resolve(false)
            else
                resolve(true)
        })
    })
}

exports.verifyUser = passport.authenticate('jwt', { session: false });