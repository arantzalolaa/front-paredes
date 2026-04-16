const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async ({ name, email, password }) => {
  const existeUsuario = await prisma.users.findUnique({
    where: { email },
  });

  if (existeUsuario) {
    throw new Error('El correo ya existe');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await prisma.users.create({
    data: {
      name,
      email,
      password: hashPassword,
    },
  });

  return {
    message: 'Usuario registrado correctamente',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

const login = async (email, password) => {
  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Credenciales Invalidas');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Credenciales Invalidas');
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return {
    message: 'login correcto',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

const getUsers = async () => {
  return await prisma.users.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};

const getUserById = async (id) => {
  const user = await prisma.users.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  return user;
};

const updateUser = async (id, { name, email, password }) => {
  const data = { name, email };

  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }

  const user = await prisma.users.update({
    where: { id: Number(id) },
    data,
    select: { id: true, name: true, email: true },
  });

  return { message: 'Usuario actualizado', user };
};

const deleteUser = async (id) => {
  await prisma.users.delete({
    where: { id: Number(id) },
  });
  return { message: 'Usuario eliminado' };
};

module.exports = {
  login,
  register,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
