import User from '../User/user.model.js';

export const register = async (req, res) => {
    try {
        const data = req.body;
        
        const user = new User(data);
        await user.save();

        return res.status(201).send({
            success: true,
            message: 'Usuario registrado correctamente (Sin encriptar)',
            user
        });
    } catch (err) {
        return res.status(500).send({ 
            success: false, 
            message: 'Error al registrar', 
            err: err.message 
        });
    }
};

export const login = async (req, res) => {
    try {
        const { UserEmail, UserPassword } = req.body;

        // 1. Buscar al usuario por correo
        const user = await User.findOne({ UserEmail });

        // 2. Verificar si existe y si la contraseña es EXACTAMENTE igual
        if (user && user.UserPassword === UserPassword) {
            return res.send({
                success: true,
                message: `Bienvenido, ${user.UserName}`,
                user
            });
        }

        return res.status(401).send({ 
            success: false, 
            message: 'Correo o contraseña incorrectos' 
        });
    } catch (err) {
        return res.status(500).send({ 
            success: false, 
            message: 'Error en el login', 
            err: err.message 
        });
    }
};