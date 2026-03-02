import { Router } from 'express';
import { getCards, createCard, updateCard, changeCardStatus, approveCard } from './card.controller.js';
import { validateCreateCard, validateCardId, validatePayCreditCard } from '../../middlewares/card.validator.js';
import { uploadCardImage } from '../../middlewares/file-uploader.js'; 

const router = Router();

router.get('/', getCards);

router.post(
    '/',
    uploadCardImage.single('image'), 
    validateCreateCard,
    createCard
);
router.put('/:id', validateCardId, uploadCardImage.single('image'), updateCard);
router.put('/:id/status', validateCardId, changeCardStatus);
router.put('/:id/approve', approveCard);
export default router;