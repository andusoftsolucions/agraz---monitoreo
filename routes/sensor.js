const { consultarRegistrosPorRangoDeFecha } = require('../controllers/SensorsControllers');
const express = require('express');
const router = express.Router();

router.get('/dataSensors', async (req, res) => {
  const rango = req.query.range;
  try {
    const activaciones = await consultarRegistrosPorRangoDeFecha(rango);
    res.json(activaciones);
  } catch (error) {
    console.error('Error al consultar los registros:', error);
    res.status(500).json({ error: 'Error al consultar los registros', details: error.message });
  }
});

module.exports = router;