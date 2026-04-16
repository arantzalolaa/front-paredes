const express = require('express');
const alumnosController = require('../controllers/alumnos.controller');

const router = express.Router();

router.get('/', alumnosController.getAlumnos);
router.get('/:id', alumnosController.getAlumnoById);
router.post('/', alumnosController.createAlumno);
router.put('/:id', alumnosController.updateAlumno);
router.delete('/:id', alumnosController.deleteAlumno);

module.exports = router;
