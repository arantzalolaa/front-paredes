const express = require('express');
const { generarTexto } = require('../services/gemini.service');

const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    const respuesta = await generarTexto(prompt);
    res.json({ reply: respuesta });
  } catch {
    res.status(500).json({ error: 'Error con Gemini' });
  }
});

module.exports = router;
