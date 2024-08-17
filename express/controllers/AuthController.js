const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const prisma = require("../prisma/client");
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }

    const hashPwd = await bcrypt.hash(req.body.password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                email: req.body.email,
                password: hashPwd,
                name: req.body.name
            }
        })

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }

    try {
        // cek email found
        const emailFound = await prisma.user.findUnique({
            where: {
                email: req.body.email
            }
        });
        if (!emailFound) {
            return res.status(404).json({ message: 'Email not found' });
        } 
        // cek password
        const match = await bcrypt.compare(req.body.password, emailFound.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // generate token
        const token = jwt.sign({ id: emailFound.id, email: emailFound.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json(token);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

module.exports = { register, login }