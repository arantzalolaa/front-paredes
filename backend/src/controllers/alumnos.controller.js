const alumnosService = require('../services/alumnos.service');

const getAlumnos = async (_req, res) => {
  try {
    const alumnos = await alumnosService.getAlumnos();
    res.json(alumnos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAlumnoById = async (req, res) => {
  try {
    const alumno = await alumnosService.getAlumnoById(req.params.id);
    res.json(alumno);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createAlumno = async (req, res) => {
  try {
    const alumno = await alumnosService.createAlumno(req.body);
    res.status(201).json(alumno);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateAlumno = async (req, res) => {
  try {
    const alumno = await alumnosService.updateAlumno(req.params.id, req.body);
    res.json(alumno);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteAlumno = async (req, res) => {
  try {
    const response = await alumnosService.deleteAlumno(req.params.id);
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAlumnos,
  getAlumnoById,
  createAlumno,
  updateAlumno,
  deleteAlumno,
};
