import Debt from './debt.model.js';
import User from '../User/user.model.js';

export const getDebts = async (req, res) => {
    try {
        const { page = 1, limit = 10, debtorId, status } = req.query;
        const filter = {};
        if (debtorId) filter.debtorId = debtorId;
        if (status) filter.status = status;

        const debts = await Debt.find(filter)
            .populate('debtorId', 'UserName UserSurname UserEmail') // Datos del deudor
            .populate('creditorId', 'UserName UserSurname') // Datos del acreedor
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ dueDate: 1 });

        const total = await Debt.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: debts,
            pagination: {
                total,
                limit: parseInt(limit),
                page: parseInt(page)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createDebt = async (req, res) => {
    try {
        const data = req.body;

        // ¡La magia de Roberto! Si no mandan acreedor, el Banco (ADMIN) asume la deuda
        if (!data.creditorId) {
            // Buscamos al primer usuario que sea ADMIN
            const bankAdmin = await User.findOne({ UserRol: 'ADMIN' });
            
            if (!bankAdmin) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'No se encontró un usuario ADMIN (Banco) para asignar como acreedor. Por favor, crea un administrador primero.' 
                });
            }
            // Le asignamos el ID del banco a la deuda
            data.creditorId = bankAdmin._id;
        }

        const debt = new Debt(data);
        await debt.save();
        res.status(201).json({ success: true, message: 'Deuda registrada exitosamente', data: debt });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const registerPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;

        const debt = await Debt.findById(id);
        if (!debt) return res.status(404).json({ success: false, message: 'Deuda no encontrada' });

        if (debt.status === 'Pagado') {
            return res.status(400).json({ success: false, message: 'Ya está pagada' });
        }

        debt.remainingAmount = Math.max(0, debt.remainingAmount - amount);
        
        if (debt.remainingAmount === 0) debt.status = 'Pagado';
        else debt.status = 'Parcial';

        await debt.save();
        res.status(200).json({ success: true, message: 'Abono registrado', data: debt });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};