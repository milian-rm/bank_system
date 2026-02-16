
import { Router } from "express";
import { createAccount, getAccounts } from "./account.controller.js";
import { validateCreateAccount } from "../../middlewares/account.validator.js"; 

const router = Router();

router.post('/', validateCreateAccount, createAccount);
router.get('/', getAccounts);

export default router;