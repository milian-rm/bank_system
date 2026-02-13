
import { Router } from 'express';
import { createPayment, getPayments } from './payment.controller.js';
import { paymentValidator } from './payment.validator.js';

const api = Router();

api.post('/', [paymentValidator], createPayment);
api.get('/', getPayments);

export default api;