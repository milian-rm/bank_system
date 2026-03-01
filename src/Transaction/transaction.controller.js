'use strict';

import Transaction from './transaction.model.js';
import Account from '../Account/account.model.js';
import Card from '../Card/card.model.js';
import Loan from '../Loan/loan.model.js';
import { convertCurrency } from '../Exchange/exchange.service.js';

// 1. Crear una transacción (Mantenemos la lógica robusta de Roberto)
export const createTransaction = async (req, res) => {
    try {
        const {
            type, amount, currency = 'GTQ',
            originAccount, destinationAccount,
            card, loan, description
        } = req.body;

        const account = await Account.findById(originAccount);
        if (!account) return res.status(404).json({ success: false, message: 'Cuenta origen no encontrada' });
        if (account.state === 'INACTIVA' || account.isActive === false) return res.status(400).json({ success: false, message: 'La cuenta origen está inactiva' });
        const conversionOrigen = await convertCurrency(amount, currency, account.currency);
        const montoParaOrigen = Number(conversionOrigen.result);
        const rate = conversionOrigen.rate;

        const { result: amountInGTQ } = await convertCurrency(amount, currency, 'GTQ');

        switch (type) {
            case 'DEPOSIT':
                account.balance += montoParaOrigen;
                break;

            case 'WITHDRAWAL':
            case 'CARD_PAYMENT':
            case 'SERVICE_PAYMENT':
                if (account.balance < montoParaOrigen)
                    return res.status(400).json({ success: false, message: 'Fondos insuficientes' });
                account.balance -= montoParaOrigen;
                break;

            case 'TRANSFER':
                if (!destinationAccount)
                    return res.status(400).json({ success: false, message: 'Cuenta destino requerida' });

                const destAccount = await Account.findById(destinationAccount);
                if (!destAccount)
                    return res.status(404).json({ success: false, message: 'Cuenta destino no encontrada' });
                if (destAccount.state === 'INACTIVA' || destAccount.isActive === false) return res.status(400).json({ success: false, message: 'La cuenta destino está inactiva' });
                const conversionDest = await convertCurrency(amount, currency, destAccount.currency);
                const montoParaDestino = Number(conversionDest.result);

                if (account.balance < montoParaOrigen)
                    return res.status(400).json({ success: false, message: 'Fondos insuficientes' });

                account.balance -= montoParaOrigen;
                destAccount.balance += montoParaDestino;
                
                await destAccount.save();
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
            message: `Transacción de tipo ${type} realizada con éxito`,
            data: {
                transaccion: transaction,
                nuevoSaldoOrigen: account.balance
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al procesar transacción', error: error.message });
    }
};

// 2. Obtener todas las transacciones de un usuario general (La de Roberto)
export const getTransactions = async (req, res) => {
    try {
        const userId = req.user._id;

        const { page = 1, limit = 10 } = req.query;

        const userAccounts = await Account.find({ user: userId }).distinct('_id');

        const transactions = await Transaction.find({
            originAccount: { $in: userAccounts }
        })
        .populate({
            path: 'originAccount',
            select: 'accountNumber accountType currency bank' 
        })
        .populate({
            path: 'destinationAccount',
            select: 'accountNumber accountType currency bank user',
            populate: { path: 'user', select: 'UserName UserSurname' } 
        })
        .populate('card', 'cardNumber type')
        .populate('loan', 'loanType amount')
        .sort({ createdAt: -1 }); 

        res.status(200).json({
            success: true,
            total: transactions.length,
            data: transactions,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el historial de transacciones',
            error: error.message
        });
    }
};

// 3. Obtener el historial ESPECÍFICO de una cuenta (Tu función, pero adaptada a las variables de Roberto)
export const getAccountHistory = async (req, res) => {
    try {
        const { id } = req.params; 

        // 1. Buscamos todas las salidas (Usando la estructura de Roberto: originAccount)
        const salidas = await Transaction.find({ originAccount: id })
            .populate('originAccount', 'accountNumber bank')
            .populate('destinationAccount', 'accountNumber bank');

        // 2. Buscamos todas las entradas (Usando la estructura de Roberto: destinationAccount)
        const entradas = await Transaction.find({ destinationAccount: id })
            .populate('originAccount', 'accountNumber bank')
            .populate('destinationAccount', 'accountNumber bank');

        // 3. Juntamos y ordenamos (Usando el createdAt que usa Mongoose por defecto)
        let historyRaw = [...salidas, ...entradas];
        historyRaw.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // 4. Mapeamos los datos para darles formato
        const historialFormateado = historyRaw.map(tx => {
            const esSalida = tx.originAccount && tx.originAccount._id.toString() === id;
            
            const signo = esSalida ? '-' : '+';
            const tipoMovimiento = esSalida ? 'EGRESO' : 'INGRESO';

            let descripcionMovimiento = tx.type || 'Transacción'; 

            if (esSalida && tx.destinationAccount) {
                descripcionMovimiento = `${descripcionMovimiento} a cuenta ${tx.destinationAccount.accountNumber}`;
            } else if (!esSalida && tx.originAccount) {
                descripcionMovimiento = `${descripcionMovimiento} de cuenta ${tx.originAccount.accountNumber}`;
            }

            return {
                idTransaccion: tx._id,
                fecha: tx.createdAt,
                descripcion: descripcionMovimiento,
                montoDisplay: `${signo}Q${tx.amount.toFixed(2)}`,
                montoReal: tx.amount,
                tipo: tipoMovimiento,
                motivoOriginal: tx.description 
            };
        });

        res.status(200).json({
            success: true,
            message: 'Historial de transacciones obtenido exitosamente',
            totalMovimientos: historialFormateado.length,
            data: historialFormateado
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener el historial de la cuenta', 
            error: error.message 
        });
    }
};