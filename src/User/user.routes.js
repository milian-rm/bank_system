import { Router } from 'express';
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    changeUserStatus
} from './user.controller.js';

import {
    validateCreateUser,
    validateUpdateUserRequest,
    validateUserStatusChange,
    validateGetUserById
} from '../../middlewares/user-validator.js';

import { validateJWT } from '../../middlewares/validate-jwt.js';

const router = Router();

router.get('/', validateJWT, hasRole('ADMIN'), getUsers);

router.get('/:id', 
    validateJWT, 
    validateGetUserById, 
    getUserById
);

router.post('/', validateJWT, hasRole('ADMIN'), validateCreateUser, createUser);

router.put('/:id',
    validateJWT,
    validateUpdateUserRequest, 
    updateUser
);

router.put('/:id/status',
    validateJWT,
    hasRole('ADMIN'),
    validateUserStatusChange,
    changeUserStatus
);


export default router;
