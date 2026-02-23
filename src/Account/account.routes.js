
import { Router } from "express";
import { validateCreateAccount } from "../../middlewares/account.validator.js"; 
import { createAccount, getAccounts, changeAccountStatus } from "./account.controller.js";
const router = Router();

router.post('/', validateCreateAccount, createAccount);
router.get('/', getAccounts);
router.put('/:id/status', changeAccountStatus);

export default router;