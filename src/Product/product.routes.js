'use strict';

import { Router } from 'express';
import { validateJWT, isAdmin } from '../../middlewares/validate-jwt.js';
import { getProducts, createProduct, updateProduct, deleteProduct } from './product.controller.js';

const router = Router();

// Ruta de lectura: Cualquier usuario logueado puede ver el catálogo
router.get('/', validateJWT, getProducts);

// Rutas de administración: Protegidas con isAdmin (Además del JWT)
router.post('/', [validateJWT, isAdmin], createProduct); // En la T41 agregaremos el validador aquí
router.put('/:id', [validateJWT, isAdmin], updateProduct);
router.delete('/:id', [validateJWT, isAdmin], deleteProduct);

export default router;