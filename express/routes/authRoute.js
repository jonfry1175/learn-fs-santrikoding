const authRoute = require('express').Router();
const authController = require('../controllers/AuthController');
const auth = require('../middlewares/auth');
const { validateLogin, validateRegister } = require('../utils/validators/auth');

authRoute.post(
    '/register',
    validateRegister,
    authController.register);

authRoute.post(
    '/login',
    validateLogin,
    authController.login);

module.exports = authRoute