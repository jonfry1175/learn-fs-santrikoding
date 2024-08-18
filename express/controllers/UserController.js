const prisma = require('../prisma/client');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');


const getAll = async (req, res) => {
    try {
        // bisa juga langsung findMany() untuk getALl data
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: {
                id: 'desc'
            }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            // error: error.message
        });
    }
}

const create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }

    const hashPwd = await bcrypt.hash(req.body.password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashPwd,
            }
        })

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

const getById = async (req, res) => {
    // + untuk konversi string ke number, sama dengan Number(req.params.id)
    const id = +req.params.id;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'User id not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

const updateById = async (req, res) => {
    const id = +req.params.id;
    const { name, email, password } = req.body;
    // cek validasi
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }
    try {
        // check id found
        const userFound = await prisma.user.findUnique({
            where: {
                id: id
            }
        });
        if (!userFound) {
            return res.status(404).json({ message: 'User id not found' });
        }
        const hashPwd = await bcrypt.hash(password, 10);
        const user = await prisma.user.update({
            where: {
                id: id
            },
            data: {
                name: name,
                email: email,
                password: hashPwd
            }
        });
        res.status(200).json({
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
}

const deleteById = async (req, res) => {
    const id = req.params.id;
    try {
        const userFound = await prisma.user.findUnique({
            where: {
                id: Number(id)
            }
        });
        if (!userFound) {
            return res.status(404).json({ message: 'User id not found' });
        }

        const user = await prisma.user.delete({
            where: {
                id: Number(id)
            }
        });
        res.status(204).end();
    } catch (error) {
        res.status(500).json(error.message);
    }
}

module.exports = { getAll, getById, updateById, deleteById, create }