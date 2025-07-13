import { Context } from 'hono';
import { sign } from 'hono/jwt';
import { prisma, cleanupUser } from '../util.ts';

export async function register(c: Context) {
    try {
        const { email, name, password } = await c.req.json();
        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });

        if (existingUser) {
            return c.json({
                'error': 'Email exists'
            }, 409);
        }

        const hashedPassword = await Bun.password.hash(password);
        const user = await prisma.user.create({
            data: { email, name, password: hashedPassword }
        });

        const token = await sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'fallback_secret_key_change_in_production'
        );

        return c.json({
            token, user: cleanupUser(user)
        });
    } catch (error) {
        return c.json({
            'error': 'Something went wrong'
        }, 500);
    }
}

export async function login(c: Context) {
    try {
        const { email, password } = await c.req.json();
        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!existingUser) {
            return c.json({
                'error': 'User not found'
            }, 401);
        }

        const isValid = await Bun.password.verify(password, existingUser.password);
        if (!isValid) {
            return c.json({
                'error': 'Invalid password'
            }, 401);
        }

        const token = await sign(
            { userId: existingUser.id },
            process.env.JWT_SECRET || 'fallback_secret_key_change_in_production'
        );

        return c.json({
            token, user: cleanupUser(existingUser)
        });
    } catch (error) {
        return c.json({
            'error': 'Something went wrong'
        }, 500);
    }
}
