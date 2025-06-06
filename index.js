const sequelize = require('./configuracion/db');

sequelize.authenticate()
  .then(() => console.log('Conexión exitosa'))
  .catch(err => console.error('No se pudo conectar:', err));
    