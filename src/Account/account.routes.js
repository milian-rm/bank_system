
import { Router } from "express";
import { validateCreateAccount } from "../../middlewares/account.validator.js"; 
import { createAccount, getAccounts, changeAccountStatus } from "./account.controller.js";
const router = Router();

router.post('/',
    validateJWT,
    hasRole('ADMIN'),
    validateCreateAccount,
    createAccount
);

router.get('/',
    validateJWT,
    getAccounts
);

router.put('/:id/status',
    validateJWT,
    hasRole('ADMIN'),
    validateAccountStatusChange,
    changeAccountStatus
);

export default router;