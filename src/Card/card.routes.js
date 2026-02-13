import { Router } from 'express';
import { getCards, createCard, updateCard, changeCardStatus } from './card.controller.js';
import { validateCreateCard, validateCardId } from '../../middlewares/card.validator.js';
import { uploadCardImage } from '../../middlewares/file-uploader.js'; // Asegúrate de definir esto en tus helpers

const router = Router();

router.get('/', getCards);

router.post(
    '/',
    uploadCardImage.single('image'), 
    validateCreateCard,
    createCard
);
router.put('/:id', validateCardId, uploadCardImage.single('image'), updateCard);

router.put('/:id/activate', validateCardId, changeCardStatus);
router.put('/:id/desactivate', validateCardId, changeCardStatus);

export default router;