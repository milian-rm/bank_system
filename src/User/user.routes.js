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

const router = Router();

router.get('/', getUsers);
router.get('/:id', validateGetUserById, getUserById);

router.post(
    '/',
    validateCreateUser,
    createUser
);

router.put(
    '/:id',
    validateUpdateUserRequest,
    updateUser
);

router.put('/:id/status', validateUserStatusChange, changeUserStatus);


export default router;
