const { Mensaje } = require('../models/Sensors');

exports.consultarRegistrosPorRangoDeFecha = async (rango) => {
  try {
    let startDate, endDate;
    const now = new Date();

    switch (rango) {
      case 'hoy':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;
      case 'semana':
        startDate = new Date(now.setDate(now.getDate() - now.getDay()));
        endDate = new Date(now.setDate(startDate.getDate() + 6));
        break;
      case 'mes':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      default:
        throw new Error('Rango no válido');
    }

    const registros = await Mensaje.find({
      fecha: {
        $gte: startDate,
        $lte: endDate
      }
    });

    // Procesar los registros para obtener activaciones por día y hora
    const activacionesPorDiaYHora = {};
    
    registros.forEach(registro => {
      const fecha = new Date(registro.fecha);
      const dia = fecha.toLocaleDateString('es-ES', { weekday: 'long' }); // Obtener el día en español
      const hora = fecha.getHours();

      if (!activacionesPorDiaYHora[dia]) {
        activacionesPorDiaYHora[dia] = Array(24).fill(0); // Array de 24 horas
      }
      activacionesPorDiaYHora[dia][hora]++;
    });

    return activacionesPorDiaYHora;
  } catch (error) {
    throw new Error(`Error en consultarRegistrosPorRangoDeFecha: ${error.message}`);
  }
};
