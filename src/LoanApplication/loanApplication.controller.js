// loanApplication.controller.js

import LoanApplication from "./loanApplication.model.js";
//import Loan from "../Loan/loan.model.js";
import Account from "../Account/account.model.js";


// 📌 Crear solicitud (Cliente)
export const createLoanApplication = async (req, res) => {
    try {
        const userId = req.user.uid; // Token
        const data = req.body;

        const application = new LoanApplication({
            ...data,
            applicant: userId
        });

        await application.save();

        res.status(201).json({
            success: true,
            message: 'Solicitud enviada correctamente',
            application
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear solicitud',
            error: error.message
        });
    }
};



//  Editar solo si la solicitud aún está pendiente
export const updateLoanApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const application = await LoanApplication.findById(id);

        if (!application)
            return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });

        if (application.status !== 'PENDING')
            return res.status(400).json({ success: false, message: 'No se puede modificar esta solicitud' });

        Object.assign(application, data);
        await application.save();

        res.status(200).json({
            success: true,
            message: 'Solicitud actualizada',
            application
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



// Cancelar solicitud
export const cancelLoanApplication = async (req, res) => {
    try {
        const { id } = req.params;

        const application = await LoanApplication.findById(id);

        if (!application)
            return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });

        if (application.status !== 'PENDING')
            return res.status(400).json({ success: false, message: 'No se puede cancelar esta solicitud' });

        application.status = 'CANCELLED';
        await application.save();

        res.status(200).json({
            success: true,
            message: 'Solicitud cancelada'
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



// Aprobar (ADMIN)
export const approveLoanApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.uid;

        const application = await LoanApplication.findById(id);

        if (!application)
            return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });

        if (application.status !== 'PENDING')
            return res.status(400).json({ success: false, message: 'Solicitud ya procesada' });

        // Crear préstamo 
        const loan = new Loan({
            borrower: application.applicant,
            account: application.account,
            amount: application.amount,
            termMonths: application.termMonths,
            interestRate: application.interestRate,
            remainingBalance: application.amount
        });

        await loan.save();

        // Depositar dinero en la cuenta
        const account = await Account.findById(application.account);
        account.balance += application.amount;
        await account.save();

        // Actualizar solicitud
        application.status = 'APPROVED';
        application.reviewedBy = adminId;
        application.reviewDate = new Date();

        await application.save();

        res.status(200).json({
            success: true,
            message: 'Préstamo aprobado correctamente',
            loan
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const rejectLoanApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.uid;

        const application = await LoanApplication.findById(id);

        if (!application)
            return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });

        if (application.status !== 'PENDING')
            return res.status(400).json({ success: false, message: 'Solicitud ya procesada' });

        application.status = 'REJECTED';
        application.reviewedBy = adminId;
        application.reviewDate = new Date();

        await application.save();

        res.status(200).json({
            success: true,
            message: 'Solicitud rechazada'
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



export const getLoanApplications = async (req, res) => {
    try {
        const applications = await LoanApplication.find()
            .populate('applicant', 'name email')
            .populate('account')
            .populate('reviewedBy', 'name');

        res.status(200).json({
            success: true,
            total: applications.length,
            applications
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};