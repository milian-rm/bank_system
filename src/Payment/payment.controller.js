import Payment from './payment.model.js';

export const createPayment = async (req, res) => {
    try {
        const data = req.body;
        const payment = new Payment(data);
        await payment.save();
        return res.status(201).send({ success: true, message: 'Pago realizado con éxito', payment });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'Error al procesar el pago', err });
    }
};