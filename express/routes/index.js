const route = require('express').Router();
const authRoute = require('./authRoute');
const userRoute = require('./userRoute');
// route
route.get('/', (req, res) => res.send('Hello World!'));

route.use('/auth', authRoute);
route.use('/users', userRoute);
module.exports = route