import { Router } from 'express';
import { login, register } from './auth.controller.js';
import { validateCreateUser } from '../../middlewares/user-validator.js';

const api = Router();

api.post('/register', [validateCreateUser], register);
api.post('/login', login);

export default api;