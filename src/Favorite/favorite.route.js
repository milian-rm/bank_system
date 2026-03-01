'use strict';

import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-jwt.js';
import { addFavorite, getMyFavorites, removeFavorite } from './favorite.controller.js';

const router = Router();

// Todas las rutas de favoritos requieren estar logueado
router.use(validateJWT);

router.post('/', addFavorite); // Aquí meteremos los validadores de la T39
router.get('/my-favorites', getMyFavorites);
router.delete('/:id', removeFavorite);

export default router;