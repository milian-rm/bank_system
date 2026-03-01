import { Router } from "express";
import { validateJWT, isAdmin } from "../../middlewares/validate-jwt.js";

import {
    createLoanApplication,
    updateLoanApplication,
    cancelLoanApplication,
    approveLoanApplication,
    rejectLoanApplication,
    getLoanApplications
} from "./loanApplication.controller.js";

import {
    validateCreateLoanApplication,
    validateUpdateLoanApplication
} from "../../middlewares/LoanApplication-validator.js";

const router = Router();


// CLIENTE
// Crear solicitud
router.post(
    '/',
    validateJWT,
    validateCreateLoanApplication,
    createLoanApplication
);

// Editar solicitud pero solo si es PENDING
router.put(
    '/:id',
    validateJWT,
    validateUpdateLoanApplication,
    updateLoanApplication
);

// Cancelar solicitud
router.patch(
    '/:id/cancel',
    validateJWT,
    cancelLoanApplication
);


// ADMIN
// Ver todas las solicitudes
router.get(
    '/',
    validateJWT,
    isAdmin,
    getLoanApplications
);

// Aprobar solicitud
router.patch(
    '/:id/approve',
    validateJWT,
    isAdmin,
    approveLoanApplication
);

// Rechazar solicitud
router.patch(
    '/:id/reject',
    validateJWT,
    isAdmin,
    rejectLoanApplication
);

export default router;