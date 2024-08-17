const { body } = require('express-validator');
const prisma = require('../../prisma/client');


const validateRegister = [
    body('name')
        .exists()
        .withMessage('Name is required')
        .isString().withMessage('Name must be a string'),
    body('email')
        .exists()
        .withMessage('Email is required')
        .isEmail().
        withMessage('Email must be a valid email')
        .custom(async (value) => {
            const user = await prisma.user.findUnique({ where: { email: value } });
            if (user) {
                throw new Error('Email already exists');
            }
            return true;
        }),
    body('password')
        .exists()
        .withMessage('Password is required')
        .isString()
        .withMessage('Password must be a string')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
]

const validateLogin = [
    body('email')
        .exists()
        .withMessage('Email is required')
        .isEmail().
        withMessage('Email must be a valid email'),
    body('password')
        .exists()
        .withMessage('Password is required')
        .isString()
        .withMessage('Password must be a string')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
]

module.exports = { validateRegister, validateLogin }