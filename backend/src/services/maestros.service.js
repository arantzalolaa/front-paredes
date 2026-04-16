const prisma = require('../config/prisma');

const getMaestros = async () => {
  return await prisma.maestros.findMany({
    orderBy: { id: 'asc' },
  });
};

const getMaestroById = async (id) => {
  const maestro = await prisma.maestros.findUnique({
    where: { id: Number(id) },
  });

  if (!maestro) {
    throw new Error('Maestro no encontrado');
  }

  return maestro;
};

const createMaestro = async (payload) => {
  const { id, nombre, apellido, departamento } = payload;
  const numemp = payload.numemp ?? payload.numeroEmpleado ?? payload.numero_empleado;
  const correo = payload.correo ?? payload.correoElectronico ?? payload.correo_electronico;

  if (id === undefined || id === null) {
    throw new Error('El campo id es obligatorio para crear maestros');
  }

  return await prisma.maestros.create({
    data: {
      id: Number(id),
      nombre: nombre ?? null,
      apellido: apellido ?? null,
      numemp: numemp ?? null,
      correo: correo ?? null,
      departamento: departamento ?? null,
    },
  });
};

const updateMaestro = async (id, payload) => {
  const numemp = payload.numemp ?? payload.numeroEmpleado ?? payload.numero_empleado;
  const correo = payload.correo ?? payload.correoElectronico ?? payload.correo_electronico;

  return await prisma.maestros.update({
    where: { id: Number(id) },
    data: {
      nombre: payload.nombre ?? undefined,
      apellido: payload.apellido ?? undefined,
      numemp: numemp ?? undefined,
      correo: correo ?? undefined,
      departamento: payload.departamento ?? undefined,
    },
  });
};

const deleteMaestro = async (id) => {
  await prisma.maestros.delete({
    where: { id: Number(id) },
  });

  return { message: 'Maestro eliminado' };
};

module.exports = {
  getMaestros,
  getMaestroById,
  createMaestro,
  updateMaestro,
  deleteMaestro,
};
