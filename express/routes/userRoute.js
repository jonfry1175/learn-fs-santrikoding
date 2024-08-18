const userRoute = require('express').Router();
const { getAll, create, getById, deleteById, updateById } = require('../controllers/UserController');
const auth = require('../middlewares/auth');
const { validateUser} = require('../utils/validators/user');

userRoute.get(
    '/',
    auth,
    getAll
);

userRoute.post(
    '/',
    validateUser,
    create
);

userRoute.get(
    '/:id',
    auth,
    getById
);

userRoute.put(
    '/:id',
    auth,
    validateUser,
    updateById
);

userRoute.delete(
    '/:id',
    auth,
    deleteById
);

module.exports = userRoute