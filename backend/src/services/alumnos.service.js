const prisma = require('../config/prisma');

const getAlumnos = async () => {
  return await prisma.alumnos.findMany({
    orderBy: { id: 'asc' },
  });
};

const getAlumnoById = async (id) => {
  const alumno = await prisma.alumnos.findUnique({
    where: { id: Number(id) },
  });

  if (!alumno) {
    throw new Error('Alumno no encontrado');
  }

  return alumno;
};

const createAlumno = async (payload) => {
  const { id, nombre, apellido, matricula, semestre, correo, carrera } = payload;

  if (id === undefined || id === null) {
    throw new Error('El campo id es obligatorio para crear alumnos');
  }

  return await prisma.alumnos.create({
    data: {
      id: Number(id),
      nombre: nombre ?? null,
      apellido: apellido ?? null,
      matricula: matricula ?? null,
      semestre: semestre ?? null,
      correo: correo ?? payload.correo_electronico ?? null,
      carrera: carrera ?? null,
    },
  });
};

const updateAlumno = async (id, payload) => {
  return await prisma.alumnos.update({
    where: { id: Number(id) },
    data: {
      nombre: payload.nombre ?? undefined,
      apellido: payload.apellido ?? undefined,
      matricula: payload.matricula ?? undefined,
      semestre: payload.semestre ?? undefined,
      correo: payload.correo ?? payload.correo_electronico ?? undefined,
      carrera: payload.carrera ?? undefined,
    },
  });
};

const deleteAlumno = async (id) => {
  await prisma.alumnos.delete({
    where: { id: Number(id) },
  });

  return { message: 'Alumno eliminado' };
};

module.exports = {
  getAlumnos,
  getAlumnoById,
  createAlumno,
  updateAlumno,
  deleteAlumno,
};
