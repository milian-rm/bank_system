'use strict';
import jwt from 'jsonwebtoken';
import User from '../src/User/user.model.js';

export const validateJWT = async (req, res, next) => {
    const token = req.header('x-token') || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) return res.status(401).json({ message: 'No hay token en la petición' });

    try {
        const { uid } = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(uid);

        // Verificamos si existe, si está activo y si no fue eliminado con el soft delete
        if (!user || user.UserStatus === 'INACTIVE' || user.deletedAt) {
            return res.status(401).json({ message: 'Token no válido - Usuario no disponible' });
        }

        req.user = user; // Guardamos al usuario en la req para usarlo después
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token no válido o expirado' });
    }
};