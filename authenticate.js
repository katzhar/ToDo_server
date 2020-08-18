require('dotenv/config');
let passport = require('passport');
let jwt = require('jsonwebtoken');
let Users = require('./models/users');
let LocalStrategy = require('passport-local').Strategy;
let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;

passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

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

exports.verifyUser = passport.authenticate('jwt', { session: false });
