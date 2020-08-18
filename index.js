require('dotenv/config');
const express = require('express');
const router = express.Router();
const app = express();
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const http = require('http').createServer(app);
const passport = require('passport')
const PORT = process.env.PORT || 3002;

app.use(router);
app.use(express.json());

const db = mongoose.connection;
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to DataBase'));

app.use(passport.initialize());

const index = require('./routes/index');
const signup = require('./routes/signup');
const login = require('./routes/login');
const logout = require('./routes/logout');
const todolist = require('./routes/todolist');

app.use('/index', index);
app.use('/signup', signup);
app.use('/login', login);
app.use('/logout', logout);
app.use('/todolist', todolist);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

http.listen(PORT, () => console.log('Server Started'));