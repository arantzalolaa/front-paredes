const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const aiRoutes = require('./routes/ai.routes');
const alumnosRoutes = require('./routes/alumnos.routes');
const maestrosRoutes = require('./routes/maestros.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/ai', aiRoutes);
app.use('/alumnos', alumnosRoutes);
app.use('/maestros', maestrosRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
