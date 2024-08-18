const authRoute = require('express').Router();
const { register, login } = require('../controllers/AuthController');
const { validateLogin, validateRegister } = require('../utils/validators/auth');

authRoute.post(
    '/register',
    validateRegister,
    register);

authRoute.post(
    '/login',
    validateLogin,
    login);

module.exports = authRoute