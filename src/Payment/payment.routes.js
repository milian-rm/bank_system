
import { Router } from 'express';
import { createPayment } from './payment.controller.js';
import { validatePayment } from './payment.validator.js';

const api = Router();

api.post('/', [validatePayment], createPayment);

export default api;