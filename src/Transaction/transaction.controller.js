import Transaction from './transaction.model.js';
import Account from '../Account/account.model.js';

// 1. Crear Transacción (Con lógica de descuento de saldo básica)
export const createTransaction = async (req, res) => {
    try {
        const data = req.body;
        
        // Validar que las cuentas existan
        const origin = await Account.findById(data.AccountOriginId);
        const destiny = await Account.findById(data.AccountDestinyId);

        if (!origin || !destiny) {
            return res.status(404).json({ success: false, message: 'Una de las cuentas no existe' });
        }

        // Lógica simple: Si es transferencia, verificar saldo
        if (data.Type === 'Transferencia' && origin.balance < data.Amount) {
            return res.status(400).json({ success: false, message: 'Fondos insuficientes' });
        }

        // Crear registro
        const transaction = new Transaction(data);
        await transaction.save();

        // Opcional: Aquí podrías actualizar los saldos de origin y destiny (origin.balance -= Amount...)

        res.status(201).json({
            success: true,
            message: 'Transacción registrada con éxito',
            data: transaction
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al procesar', error: error.message });
    }
};

// 2. Obtener historial (Con Populate)
export const getTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 10, accountId } = req.query;
        
        // Si mandan accountId, filtramos donde sea origen O destino
        const filter = accountId ? { 
            $or: [{ AccountOriginId: accountId }, { AccountDestinyId: accountId }] 
        } : {};

        const transactions = await Transaction.find(filter)
            .populate('AccountOriginId', 'accountNumber') // Ver número de cuenta origen
            .populate('AccountDestinyId', 'accountNumber') // Ver número de cuenta destino
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ Date: -1 });

        const total = await Transaction.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: transactions,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener transacciones', error: error.message });
    }
};

export const getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findById(id)
            .populate('AccountOriginId', 'accountNumber')
            .populate('AccountDestinyId', 'accountNumber');

        if (!transaction) return res.status(404).json({ success: false, message: 'No encontrado' });

        res.status(200).json({ success: true, data: transaction });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};