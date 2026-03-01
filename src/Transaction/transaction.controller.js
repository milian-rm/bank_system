'use strict';

import Transaction from './transaction.model.js';
import Account from '../Account/account.model.js';
import Card from '../Card/card.model.js';
import Loan from '../Loan/loan.model.js';
import { convertCurrency } from '../Exchange/exchange.service.js';

export const createTransaction = async (req, res) => {
    try {
        const {
            type, amount, currency = 'GTQ',
            originAccount, destinationAccount,
            card, loan, description
        } = req.body;

        const account = await Account.findById(originAccount);
        if (!account) return res.status(404).json({ success: false, message: 'Cuenta origen no encontrada' });

        const conversionOrigen = await convertCurrency(amount, currency, account.currency);
        const montoParaOrigen = Number(conversionOrigen.result);
        const rate = conversionOrigen.rate;

        const { result: amountInGTQ } = await convertCurrency(amount, currency, 'GTQ');

        switch (type) {
            case 'DEPOSIT':
                account.balance += montoParaOrigen;
                break;

            case 'WITHDRAWAL':
                if (account.balance < montoParaOrigen)
                    return res.status(400).json({ success: false, message: 'Fondos insuficientes' });
                account.balance -= montoParaOrigen;
                break;

            case 'TRANSFER':
                if (!destinationAccount)
                    return res.status(400).json({ success: false, message: 'Cuenta destino requerida' });

                // BUSCAR CUENTA DESTINO
                const destAccount = await Account.findById(destinationAccount);
                if (!destAccount)
                    return res.status(404).json({ success: false, message: 'Cuenta destino no encontrada' });

                // CONVERTIR MONTO A LA MONEDA DE LA CUENTA DESTINO
                const conversionDest = await convertCurrency(amount, currency, destAccount.currency);
                const montoParaDestino = Number(conversionDest.result);

                if (account.balance < montoParaOrigen)
                    return res.status(400).json({ success: false, message: 'Fondos insuficientes' });

                account.balance -= montoParaOrigen;
                destAccount.balance += montoParaDestino;
                
                await destAccount.save();
                break; 

            case 'CARD_PAYMENT':
            case 'SERVICE_PAYMENT':
                if (account.balance < montoParaOrigen)
                    return res.status(400).json({ success: false, message: 'Fondos insuficientes' });
                account.balance -= montoParaOrigen;
                break;

            case 'LOAN_PAYMENT':
                const loanData = await Loan.findById(loan);
                if (!loanData) return res.status(404).json({ success: false, message: 'Préstamo no encontrado' });

                if (account.balance < montoParaOrigen)
                    return res.status(400).json({ success: false, message: 'Fondos insuficientes' });

                account.balance -= montoParaOrigen;
                loanData.remainingBalance -= montoParaOrigen; 
                await loanData.save();
                break;

            default:
                return res.status(400).json({ success: false, message: 'Tipo de transacción inválido' });
        }

        await account.save();

        const transaction = new Transaction({
            type,
            amount,
            currency,
            exchangeRate: rate,
            amountInGTQ: Number(amountInGTQ),
            originAccount,
            destinationAccount,
            card, loan, description
        });

        await transaction.save();

        res.status(201).json({
            success: true,
            message: 'Transacción realizada correctamente',
            transaction
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al procesar transacción', error: error.message });
    }
};

export const getTransactions = async (req, res) => {
    try {
        const userId = req.user._id;

        const userAccounts = await Account.find({ user: userId }).distinct('_id');

        const transactions = await Transaction.find({
            originAccount: { $in: userAccounts }
        })
        .populate({
            path: 'originAccount',
            select: 'accountNumber accountType currency' 
        })
        .populate({
            path: 'destinationAccount',
            select: 'accountNumber accountType currency user',
            populate: { path: 'user', select: 'UserName UserSurname' } 
        })
        .populate('card', 'cardNumber type')
        .populate('loan', 'loanType amount')
        .sort({ createdAt: -1 }); 
        res.status(200).json({
            success: true,
            total: transactions.length,
            transactions
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el historial de transacciones',
            error: error.message
        });
    }
};