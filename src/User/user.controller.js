import User from './user.model.js';
import Account from '../Account/account.model.js';

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, UserStatus } = req.query;

    const filter = {};
    if (UserStatus) {
      filter.UserStatus = UserStatus;
    }

    const users = await User.find(filter)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ UserCreatedAt: -1 });

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los usuarios',
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el usuario',
      error: error.message,
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const userData = req.body;

    // 1. Guardamos al usuario (ya pasó por las validaciones de los Q100)
    const user = new User(userData);
    await user.save();

    // 2. Magia: Si es un cliente normal (USER), le generamos su cuenta bancaria automáticamente
    let newAccount = null;
    if (user.UserRol === 'USER' || !user.UserRol) {
        // Genera un número de 10 dígitos aleatorio
        const randomAccountNumber = Math.floor(Math.random() * 9000000000) + 1000000000; 
        
        newAccount = new Account({
            accountNumber: randomAccountNumber.toString(),
            accountType: 'MONETARIA', // Por defecto
            balance: 0,
            user: user._id,
            bank: 'Banco Kinal'
        });
        await newAccount.save();
    }

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: user,
      cuentaAsignada: newAccount // Devolvemos la cuenta generada para que el Admin la vea
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear el usuario',
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar el usuario',
      error: error.message,
    });
  }
};

export const changeUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    user.UserStatus =
      user.UserStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    await user.save();

    res.status(200).json({
      success: true,
      message: `Usuario ${user.UserStatus === 'ACTIVE' ? 'activado' : 'desactivado'} exitosamente`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cambiar el estado del usuario',
      error: error.message,
    });
  }
};
