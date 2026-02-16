
import { Router } from 'express';
import { createPayment, getPayments } from './payment.controller.js';
import { validatePayment } from '../../middlewares/payment.validator.js';

const api = Router();

api.post('/', [validatePayment], createPayment);
api.get('/', getPayments);

export default api;