const route = require('express').Router();
const auth = require('../middlewares/auth');
const authController = require('../controllers/AuthController');
const authRoute = require('./authRoute');

// route
route.get('/', (req, res) => res.send('Hello World!'));

route.use('/auth', authRoute);
module.exports = route