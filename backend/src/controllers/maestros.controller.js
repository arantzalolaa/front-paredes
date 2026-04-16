const maestrosService = require('../services/maestros.service');

const getMaestros = async (_req, res) => {
  try {
    const maestros = await maestrosService.getMaestros();
    res.json(maestros);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMaestroById = async (req, res) => {
  try {
    const maestro = await maestrosService.getMaestroById(req.params.id);
    res.json(maestro);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createMaestro = async (req, res) => {
  try {
    const maestro = await maestrosService.createMaestro(req.body);
    res.status(201).json(maestro);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateMaestro = async (req, res) => {
  try {
    const maestro = await maestrosService.updateMaestro(req.params.id, req.body);
    res.json(maestro);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteMaestro = async (req, res) => {
  try {
    const response = await maestrosService.deleteMaestro(req.params.id);
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getMaestros,
  getMaestroById,
  createMaestro,
  updateMaestro,
  deleteMaestro,
};
