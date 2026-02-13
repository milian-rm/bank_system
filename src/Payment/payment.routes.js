
import { Router } from 'express';
import { createPayment } from './payment.controller.js';
import { paymentValidator } from './payment.validator.js';

const api = Router();

api.post('/', [paymentValidator], createPayment);

export default api;v