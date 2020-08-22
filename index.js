require('dotenv/config');
const express = require('express');
const router = express.Router();
const app = express();
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const http = require('http').createServer(app);
const passport = require('passport');
const PORT = process.env.PORT || 3002;

app.use(router);
app.use(express.json());

mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('error', (error) => console.error(error));
mongoose.connection.once('open', () => console.log('Connected to DataBase'));

app.use(passport.initialize());

const routes = [{
    path: '/index',
    controller: require('./routes/index')
},
{
    path: '/signup',
    controller: require('./routes/signup')
},
{
    path: '/login',
    controller: require('./routes/login')
},
{
    path: '/types',
    controller: require('./routes/types')
},
{
    path: '/todolist',
    controller: require('./routes/todolist')
},
{
    path: '/logout',
    controller: require('./routes/logout')
}];

routes.map(item => app.use(item.path, item.controller));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

http.listen(PORT, () => console.log('Server Started'));