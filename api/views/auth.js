import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../util.js';

export async function register(req, res) {
    try {
        const { email, name, password } = req.body;
        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });

        if (existingUser) {
            return res.status(409).json({
                'error': 'Email exists'
            })
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const user = await prisma.user.create({
            data: { email, name, password: hashedPassword }
        });

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token, user
        });
    } catch (error) {
        res.status(500).json({
            'error': 'Something went wrong'
        });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!existingUser) {
            return res.status(401).json({
                'error': 'User not found'
            })
        }

        if (!bcrypt.compareSync(password, existingUser.password)) {
            return res.status(401).json({
                'error': 'Invalid password'
            })
        }

        const token = jwt.sign(
            { userId: existingUser.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token, user: existingUser
        });
    } catch (error) {
        res.status(500).json({
            'error': 'Something went wrong'
        });
    }
}